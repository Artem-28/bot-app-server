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
import {
  IMessengerConnectionInstance,
  MessengerConnectionAggregate,
} from '@/models/messenger-connection';
import { AuthDataRepository } from '@/repositories/auth-data';
import {
  IMessageSessionInstance,
  MessageSessionAggregate,
} from '@/models/message-session';
import { UserRepository } from '@/repositories/user';
import { MessageRepository } from '@/repositories/message';
import { MessageAggregate } from '@/models/message';
import { IUser, UserAggregate } from '@/models/user';
import { IRespondent, RespondentAggregate } from '@/models/respondent';
import { CreateMessageDto } from '@/modules/messenger/dto';
import { IScript, ScriptAggregate } from '@/models/script';

const SESSION_ROOM_KEY = '_session_room_';
const PROJECT_ROOM_KEY = '_project_room_';

@WebSocketGateway({ namespace: 'messenger' })
export class MessengerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private _connections = new Map<string, IMessengerConnectionInstance>();
  private _operators = new Map<number, IUser>();
  private _respondents = new Map<number, IRespondent>();
  private _sessions = new Map<number, IMessageSessionInstance>();
  private _scripts = new Map<number, IScript>();

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

  private setScript(script: ScriptAggregate) {
    if (!script) return;
    this._scripts.set(script.id, script.instance);
  }

  private async getScript(id: number) {
    if (this._scripts.has(id)) {
      const data = this._scripts.get(id);
      return ScriptAggregate.create(data);
    }
    const script = await this._scriptRepository.getOne({
      filter: { field: 'id', value: id },
    });
    if (!script) return null;

    this.setScript(script);
    return script;
  }

  private setSession(session: MessageSessionAggregate) {
    if (!session) return;
    this._sessions.set(session.id, session.instance);
  }

  private removeSession(id: number) {
    const session = this._sessions.get(id);
    if (!session) return;
    this._sessions.delete(id);

    let isRemoveRespondent = true;

    this._sessions.forEach((s) => {
      if (isRemoveRespondent && session.respondent_id === s.respondent_id) {
        isRemoveRespondent = false;
      }
    });

    if (isRemoveRespondent) {
      this.removeRespondent(session.respondent_id);
    }
  }

  private setOperator(operator: UserAggregate) {
    if (!operator) return;
    this._operators.set(operator.id, operator.instance);
  }

  private getOperator(id: number) {
    const data = this._operators.get(id);
    if (!data) return null;
    return UserAggregate.create(data);
  }

  private removeOperator(id: number) {
    this._operators.delete(id);
  }

  private setConnection(connection: MessengerConnectionAggregate) {
    if (!connection) return;
    this._connections.set(connection.client_id, connection.instance);
  }

  private removeConnection(id: string) {
    const connection = this._connections.get(id);
    if (!connection) return;
    this._connections.delete(id);

    let isRemoveOperator = !!connection.operator_id;
    let isRemoveSession = !!connection.session_id;

    this._connections.forEach((connect) => {
      if (isRemoveOperator && connection.operator_id === connect.operator_id) {
        isRemoveOperator = false;
      }
      if (isRemoveSession && connection.session_id === connect.session_id) {
        isRemoveSession = false;
      }
    });

    if (isRemoveOperator) {
      this.removeOperator(connection.operator_id);
    }

    if (isRemoveSession) {
      this.removeSession(connection.session_id);
    }
  }

  private getConnection(id: string) {
    const data = this._connections.get(id);
    if (!data) return null;

    const connection = MessengerConnectionAggregate.create(data);

    const operator = this.getOperator(connection.operator_id);
    if (operator) {
      connection.setOperator(operator);
    }

    return connection;
  }

  private setRespondent(respondent: RespondentAggregate) {
    if (!respondent) return;
    this._respondents.set(respondent.id, respondent.instance);
  }

  private async getRespondent(id: number) {
    if (this._respondents.has(id)) {
      const data = this._respondents.get(id);
      return RespondentAggregate.create(data);
    }
    // Может быть такое когда оператор отправляет сообщение респонденту который еще не подключен к сессии
    // поэтому если нет загруженного респондента загружаем его
    const respondent = await this._respondentRepository.getOne({
      filter: { field: 'id', value: id },
    });
    if (!respondent) return null;

    this.setRespondent(respondent);
    return respondent;
  }

  private removeRespondent(id: number) {
    this._respondents.delete(id);
  }

  private async getConnectionData(socket: Socket) {
    const headers = socket.handshake.headers;

    let project_id: number | null = Number(headers['project-id']);
    let script_id: number | null = null;
    let operator_login: string | null = null;
    let respondent_id: number | null = null;

    const token = headers['authorization'] as string;
    if (!token) {
      throw new CommonError({ messages: 'unauthorized' }, 403);
    }

    const data = this._jwtService.verify(token, jwtConfig.verifyOptions);
    if (data.project_id) {
      project_id = data.project_id;
    }
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

    if ((!is_respondent && !is_operator) || !project_id) {
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

  // Обработка сообщения от респондента
  private async handleRespondentSendMessage(dto: CreateMessageDto) {
    const message = await this._messengerService.createMessage(dto);
    await this.emitMessage(message);
  }

  // Обработка сообщения от оператора
  private async handleOperatorSendMessage(dto: CreateMessageDto) {
    const message = await this._messengerService.createMessage(dto);
    await this.emitMessage(message);
  }

  private async emitMessage(message: MessageAggregate) {
    const session = message.session;

    this.setSession(session);

    const script = await this.getScript(session.script_id);
    if (script) {
      session.setScript(script);
    }

    const respondent = await this.getRespondent(session.respondent_id);
    if (respondent) {
      message.session.setRespondent(respondent);
    }

    const operator = this.getOperator(message.operator_id);
    if (operator) {
      message.setOperator(operator);
    }
    // Сообщения для операторов
    this.server
      .to(PROJECT_ROOM_KEY + session.project_id)
      .emit('onmessage', message);
    // Сообщения для респондентов
    this.server
      .to(SESSION_ROOM_KEY + session.id)
      .emit('onmessage', message.transform());
  }

  async handleConnection(socket: Socket) {
    try {
      const data = await this.getConnectionData(socket);

      // Обработка подключения оператора
      if (!data.is_respondent) {
        const connection = await this._messengerService.operatorConnect({
          client_id: data.client_id,
          project_id: data.project_id,
          operator_login: data.operator_login,
        });
        this.setConnection(connection);
        this.setOperator(connection.operator);

        socket.join(PROJECT_ROOM_KEY + connection.project_id);
        socket.emit('connected');
        return;
      }
      // Обработка подключения респондента
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
      this.setConnection(connection);
      this.setSession(session);
      this.setScript(session.script);
      this.setRespondent(session.respondent);

      socket.join(SESSION_ROOM_KEY + session.id);
      socket.emit('connected');
    } catch (e) {
      throw new CommonError({ messages: e });
    }
  }

  async handleDisconnect(socket: Socket) {
    const connection = this.getConnection(socket.id);
    if (!connection) return;

    this.removeConnection(socket.id);
    await this._messengerService.disconnect(connection);
  }

  @SubscribeMessage('send_message')
  async sendMessage(socket: Socket, dto: any) {
    const connection = this.getConnection(socket.id);
    if (!connection) return;

    // Сообщение отправляет оператор
    if (connection.operator_id) {
      await this.handleOperatorSendMessage({
        session_id: dto.session_id,
        text: dto.text,
        operator_id: connection.operator_id,
      });
      return;
    }

    // Сообщение отправляет респондент
    if (connection.session_id) {
      await this.handleRespondentSendMessage({
        session_id: connection.session_id,
        text: dto.text,
      });
    }
  }
}
