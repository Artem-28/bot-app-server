import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RespondentRepository } from '@/repositories/respondent';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ScriptRepository } from '@/repositories/script';
import { MessageSessionRepository } from '@/repositories/message-session';
import { MessengerService } from '@/modules/messenger';
import { JwtService } from '@nestjs/jwt';
import { RespondentService } from '@/modules/respondent';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';
import { CommonError } from '@/common/error';
import { jwtConfig } from '@/providers/jwt';
import { MessengerConnectionRepository } from '@/repositories/messenger-connection';
import { MapObject } from '@/common/types';
import { MessengerConnectionAggregate } from '@/models/messenger-connection';
import { AuthDataRepository } from '@/repositories/auth-data';
import { MessageSessionAggregate } from '@/models/message-session';
import { UserRepository } from '@/repositories/user';
import { OperatorMessageDto } from '@/modules/messenger/dto';
import { MessageRepository } from '@/repositories/message';
import { MessageAggregate } from '@/models/message';

const SESSION_ROOM_KEY = '_session_room_';
const PROJECT_ROOM_KEY = '_project_room_';

@WebSocketGateway({ namespace: 'messenger' })
export class MessengerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private _connectionMap: MapObject<MessengerConnectionAggregate> = {};
  private _sessionMap: MapObject<MessageSessionAggregate> = {};

  private readonly _respondentRepository = new RespondentRepository(
    this._dataSource,
  );
  private readonly _authDataRepository = new AuthDataRepository(
    this._dataSource,
  );
  private readonly _userRepository = new UserRepository(this._dataSource);
  private readonly _respondentFingerprintRepository =
    new RespondentFingerprintRepository(this._dataSource);

  private readonly _scriptRepository = new ScriptRepository(this._dataSource);

  private readonly _messageSessionRepository = new MessageSessionRepository(
    this._dataSource,
  );

  private readonly _messageRepository = new MessageRepository(this._dataSource);

  private readonly _respondentService = new RespondentService(
    this._respondentRepository,
    this._respondentFingerprintRepository,
  );

  private readonly _connectionRepository = new MessengerConnectionRepository(
    this._dataSource,
  );

  private readonly _messengerService = new MessengerService(
    this._jwtService,
    this._respondentService,
    this._userRepository,
    this._scriptRepository,
    this._messageSessionRepository,
    this._messageRepository,
    this._connectionRepository,
  );

  constructor(
    @Inject(DataSource)
    private readonly _dataSource: DataSource,
    private readonly _jwtService: JwtService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const data = await this.getConnectionData(socket);

      if (!data.is_respondent) {
        const connection = await this._messengerService.operatorConnect({
          client_id: data.client_id,
          project_id: data.project_id,
          operator_login: data.operator_login,
        });
        this._connectionMap[connection.client_id] = connection;
        socket.join(PROJECT_ROOM_KEY + connection.project_id);
        return;
      }
      const session = await this._messengerService.actualSession({
        project_id: data.project_id,
        script_id: data.script_id,
        respondent_id: data.respondent_id,
      });
      const connection = await this._messengerService.respondentConnect({
        client_id: data.client_id,
        project_id: session.project_id,
        session_id: session.id,
      });
      this._sessionMap[session.id] = session;
      this._connectionMap[connection.client_id] = connection;
      socket.join(SESSION_ROOM_KEY + session.id);
    } catch (e) {
      throw new CommonError({ messages: e });
    }
  }

  async handleDisconnect(socket: Socket) {
    const connection = this._connectionMap[socket.id];
    if (!connection) return;

    await this._messengerService.disconnect(connection);
    delete this._connectionMap[socket.id];
    if (!connection.session_id) return;

    const connections = this.getSessionConnections(connection.session_id);
    if (connections.length > 0) return;

    delete this._sessionMap[connection.session_id];
  }

  @SubscribeMessage('send_message')
  async sendMessage(socket: Socket, dto: any) {
    const connection = this._connectionMap[socket.id];
    if (!connection) return;
    if (connection.operator_id) {
      this.handleOperatorSendMessage(connection, dto);
      return;
    }
    if (connection.session_id) {
      this.handleRespondentSendMessage(connection, dto);
    }
  }

  private async handleRespondentSendMessage(
    connection: MessengerConnectionAggregate,
    dto: any,
  ) {
    const session = this._sessionMap[
      connection.session_id
    ] as MessageSessionAggregate;

    if (!session) {
      throw new CommonError({ messages: 'invalid_session' });
    }
    const message = await this._messengerService.createMessage({
      session_id: session.id,
      text: dto.text,
      respondent_id: session.respondent_id,
    });
    message.setAuthor(session.respondent);
    this.emitMessage(message);
  }

  private async handleOperatorSendMessage(
    connection: MessengerConnectionAggregate,
    dto: any,
  ) {
    const session = this._sessionMap[dto.session_id] as MessageSessionAggregate;
    if (!session) {
      throw new CommonError({ messages: 'invalid_session' });
    }
    const message = await this._messengerService.createMessage({
      session_id: session.id,
      text: dto.text,
      operator_id: connection.operator_id,
    });
    message.setAuthor(connection.operator);
    this.emitMessage(message);
  }

  private emitMessage(message: MessageAggregate) {
    const session = message.session;
    this.server.to(PROJECT_ROOM_KEY + session.project_id).emit('onmessage', {
      ...message.instance,
      from: message.author,
    });
    this.server.to(SESSION_ROOM_KEY + session.id).emit('onmessage', {
      ...message.instance,
      from: { name: message.author.name },
    });
  }

  private getSessionConnections(sessionId: number) {
    return Object.values(this._connectionMap).filter(
      (connection) => connection.session_id === sessionId,
    );
  }

  private async getConnectionData(socket: Socket) {
    const headers = socket.handshake.headers;

    let project_id: number | null = null;
    let script_id: number | null = null;
    let operator_login: string | null = null;
    let respondent_id: number | null = null;

    if (typeof headers['project-id'] !== 'string') {
      throw new CommonError({ messages: 'errors.invalid_headers' });
    }
    project_id = Number(headers['project-id']);

    const token = headers['authorization'] as string;
    if (!token) {
      throw new CommonError({ messages: 'unauthorized' }, 403);
    }

    const data = this._jwtService.verify(token, jwtConfig.verifyOptions);
    if (data.script_id) {
      script_id = data.script_id;
    }
    if (data.authDataId) {
      const auth_data = await this._authDataRepository.getOne({
        filter: { field: 'id', value: data.authDataId },
      });
      operator_login = auth_data.login;
    }
    if (data.respondent_id) {
      respondent_id = data.respondent_id;
    }

    const is_operator = !!operator_login;
    const is_respondent = !is_operator && !!respondent_id && !!script_id;

    if (!is_respondent && !is_operator) {
      throw new CommonError({ messages: 'invalid_token' }, 403);
    }

    return {
      client_id: socket.id,
      is_respondent,
      project_id,
      script_id,
      respondent_id,
      operator_login,
    };
  }
}
