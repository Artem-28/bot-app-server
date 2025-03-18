import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ChatConnectionRepository } from '@/repositories/chat-connection';
import { UserRepository } from '@/repositories/user';
import { RespondentRepository } from '@/repositories/respondent';
import { JwtChatGuard } from '@/providers/gateway';
import { ChatConnectionAggregate } from '@/models/chat-connections';
import { ChatSessionRepository } from '@/repositories/chat-session';
import { ChatSessionAggregate } from '@/models/chat-session';
import { ScriptRepository } from '@/repositories/script';
import { CommonError } from '@/common/error';
import { MapObject } from '@/common/types';
import { jwtConfig } from '@/providers/jwt';
import * as bcrypt from 'bcrypt';

@WebSocketGateway({ namespace: 'ws/chats' })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private _connectionMap: MapObject<ChatConnectionAggregate> = {};
  private _connectionSessionMap: MapObject<ChatSessionAggregate> = {};
  private _operatorConnectionMap: MapObject<ChatConnectionAggregate[]> = {};

  private readonly _chatConnectionRepository = new ChatConnectionRepository(
    this._dataSource,
  );
  private readonly _chatSessionRepository = new ChatSessionRepository(
    this._dataSource,
  );
  private readonly _userRepository = new UserRepository(this._dataSource);
  private readonly _respondentRepository = new RespondentRepository(
    this._dataSource,
  );
  private readonly _scriptRepository = new ScriptRepository(this._dataSource);

  readonly jwtChatGuard = new JwtChatGuard(
    this._jwtService,
    this._chatConnectionRepository,
    this._userRepository,
    this._respondentRepository,
  );

  constructor(
    @Inject(DataSource)
    private readonly _dataSource: DataSource,
    private readonly _jwtService: JwtService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const context = this._getContext(socket);
      const canConnect = await this.jwtChatGuard.canActivate(context);
      if (!canConnect) {
        socket.disconnect(true);
        return;
      }

      const connection = socket['connection'];
      connection.update({ connected: true, socketId: socket.id });
      const result = await this._chatConnectionRepository.update(
        connection.id,
        connection.instance,
      );
      const success = !!result.affected;
      if (!success) {
        socket.disconnect(true);
        return;
      }
      this._connectionMap[connection.id] = connection;

      const isOperator = !!connection.operator;
      if (!isOperator) {
        await this._setRespondentSession(socket);
        return;
      }
      if (!this._operatorConnectionMap.hasOwnProperty(connection.projectId)) {
        this._operatorConnectionMap[connection.projectId] = [];
      }
      this._operatorConnectionMap[connection.projectId].push(connection);
    } catch (e) {
      console.error(e);
      socket.disconnect(true);
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(socket: Socket, dto: any) {
    const wsContext = this._getContext(socket).switchToWs();
    const connection = await wsContext.getConnection();
    if (!connection) return;

    if (connection.respondent) {
      await this._handleSendRespondentMessage(connection, dto);
    }
    if (connection.operator) {
      await this._handleSendOperatorMessage(connection, dto);
    }
  }

  private async _handleSendRespondentMessage(
    connection: ChatConnectionAggregate,
    dto: any,
  ) {
    const operators = this._operatorConnectionMap[connection.projectId] || [];
    operators.forEach((client) => {
      this.server.to(client.socketId).emit('onMessage', dto);
    });
  }

  private async _handleSendOperatorMessage(
    connection: ChatConnectionAggregate,
    dto: any,
  ) {
    console.log('connection', connection);
    console.log('MESSAGE', dto);
  };

  private async _setRespondentSession(socket: Socket) {
    const connection = await this._getContext(socket)
      .switchToWs()
      .getConnection();
    if (!connection || !connection.respondentId || !connection.scriptId) {
      throw new CommonError({ messages: 'errors.create.session' });
    }

    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: connection.scriptId },
        { field: 'projectId', value: connection.projectId, operator: 'and' },
      ],
    });
    if (!script) {
      throw new CommonError({ messages: 'errors.create.session' });
    }

    let session = await this._chatSessionRepository.getOne({
      filter: [
        { field: 'projectId', value: connection.projectId },
        { field: 'scriptId', value: connection.scriptId, operator: 'and' },
        {
          field: 'respondentId',
          value: connection.respondentId,
          operator: 'and',
        },
      ],
    });
    if (!session) {
      session = await this._chatSessionRepository.create(
        ChatSessionAggregate.create({
          projectId: connection.projectId,
          scriptId: connection.scriptId,
          respondentId: connection.respondentId,
          title: script.title,
        }).instance,
      );
    }

    socket['chatSession'] = session;
    this._connectionSessionMap[connection.id] = session;
  }

  private _getContext(socket: Socket) {
    return {
      switchToWs: () => ({
        getClient: () => socket,
        getConnection: async () => {
          const headers = socket.handshake.headers;
          const token = headers.autharization as string;
          if (!token) return null;

          const payload = this._jwtService.verify(
            token,
            jwtConfig.verifyOptions,
          );
          if (!payload.connectionId) return null;

          const connection = this._connectionMap[payload.connectionId];
          const matched = await bcrypt.compare(
            payload.connectionKey,
            connection.key,
          );
          if (!matched) return null;

          return connection as ChatConnectionAggregate;
        },
      }),
    } as any;
  }
}
