import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RespondentRepository } from '@/repositories/respondent';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

@WebSocketGateway({ namespace: 'ws/messengers' })
export class MessengerWebsocket implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly _respondentRepository = new RespondentRepository(this._dataSource);

  constructor(
    @Inject(DataSource)
    private readonly _dataSource: DataSource,
  ) {}

  handleConnection(socket: Socket): any {
    console.log('RESPONDENT');
  }
}
