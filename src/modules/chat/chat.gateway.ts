import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatGuard } from '@/providers/jwt';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChatService } from '@/modules/chat/chat.service';
import { ChatSessionRepository } from '@/repositories/chat-session';
import { ScriptRepository } from '@/repositories/script';
import { RespondentRepository } from '@/repositories/respondent';
import { RespondentAggregate } from '@/models/respondent';
import { ChatSessionAggregate } from '@/models/chat-session';

@WebSocketGateway({ namespace: 'ws/chats' })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly _chatSessionRepository = new ChatSessionRepository(
    this._dataSource,
  );
  private readonly _scriptRepository = new ScriptRepository(this._dataSource);
  private readonly _respondentRepository = new RespondentRepository(
    this._dataSource,
  );

  private readonly _chatGuard = new ChatGuard(
    this._jwtService,
    this._chatSessionRepository,
    this._respondentRepository,
  );

  private readonly _chetService = new ChatService(
    this._jwtService,
    this._chatSessionRepository,
    this._scriptRepository,
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
      const canConnect = await this._chatGuard.canActivate(context);
      if (!canConnect) {
        socket.disconnect(true);
        return;
      }
    } catch (exception) {
      console.error(exception);
      socket.disconnect(true);
    }
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(socket: Socket, dto: any) {
    const context = this._getContext(socket).switchToWs();
    const respondent = context.getRespondent();
    const session = context.getSession();
    console.log('RESPONDENT', respondent);
    console.log('SESSION', session);
    console.log('DTO', dto);
  }

  private _getContext(socket: Socket) {
    return {
      switchToWs: () => ({
        getClient: () => socket,
        getRespondent: () => {
          const respondent = socket['respondent'];
          if (!respondent) return null;
          return respondent as RespondentAggregate;
        },
        getSession: () => {
          const session = socket['chatSession'];
          if (!session) return null;
          return session as ChatSessionAggregate;
        },
      }),
    } as any;
  }
}
