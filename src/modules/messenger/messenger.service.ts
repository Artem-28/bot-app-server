import { Injectable } from '@nestjs/common';
import {
  AuthMessengerDto,
  OperatorConnectionDto,
  RespondentConnectionDto,
  SessionDto,
} from '@/modules/messenger/dto';
import { RespondentService } from '@/modules/respondent';
import { ScriptRepository } from '@/repositories/script';
import { CommonError, errors } from '@/common/error';
import { MessageSessionRepository } from '@/repositories/message-session';
import { MessageSessionAggregate } from '@/models/message-session';
import { JwtService } from '@nestjs/jwt';
import { MessengerConnectionRepository } from '@/repositories/messenger-connection';
import { MessengerConnectionAggregate } from '@/models/messenger-connection';
import { UserRepository } from '@/repositories/user';

@Injectable()
export class MessengerService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _respondentService: RespondentService,
    private readonly _userRepository: UserRepository,
    private readonly _scriptRepository: ScriptRepository,
    private readonly _messageSessionRepository: MessageSessionRepository,
    private readonly _connectionRepository: MessengerConnectionRepository,
  ) {}

  public async getConnectionToken(dto: AuthMessengerDto) {
    // Получаем скрипт
    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: dto.script_id },
        { field: 'project_id', value: dto.project_id, operator: 'and' },
      ],
    });
    // Если скрипт не был найден возврашаем ошибку
    if (!script) {
      throw new CommonError({ messages: errors.messenger.connect });
    }
    // Идентифицируем пользователя по отпечаткам
    const respondent = await this._respondentService.respondentIdentity(
      script.project_id,
      dto.fingerprint,
    );

    return this._jwtService.sign({
      respondent_id: respondent.id,
      script_id: script.id,
    });
  }

  public async actualSession(dto: SessionDto) {
    // Ищем последнюю активную сессию
    let session = await this._messageSessionRepository.getOne({
      filter: [
        { field: 'project_id', value: dto.project_id },
        { field: 'script_id', value: dto.script_id, operator: 'and' },
        { field: 'respondent_id', value: dto.respondent_id, operator: 'and' },
      ],
      relation: { name: 'respondent', method: 'leftJoinAndSelect' },
    });

    if (session) return session;

    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: dto.script_id },
        { field: 'project_id', value: dto.project_id, operator: 'and' },
      ],
    });
    // Если скрипт не был найден возврашаем ошибку
    if (!script) {
      throw new CommonError({ messages: errors.messenger.connect });
    }

    const respondent = await this._respondentService.getRespondent(
      dto.respondent_id,
      script.project_id,
    );
    if (!respondent) {
      throw new CommonError({ messages: errors.messenger.connect });
    }

    // Создаем сессию для идентифицированного пользователя
    const session_instance = MessageSessionAggregate.create({
      project_id: script.project_id,
      script_id: script.id,
      respondent_id: respondent.id,
      title: script.title,
    }).instance;

    session = await this._messageSessionRepository.create(session_instance);
    session.update({ respondent });
    return session;
  }

  public respondentConnect(dto: RespondentConnectionDto) {
    const instance = MessengerConnectionAggregate.create(dto).instance;
    return this._connectionRepository.create(instance);
  }

  public async operatorConnect(dto: OperatorConnectionDto) {
    const user = await this._userRepository.getOne({
      filter: { field: 'email', value: dto.operator_login },
    });

    if (!user) {
      throw new CommonError({ messages: errors.messenger.connect });
    }
    const instance = MessengerConnectionAggregate.create({
      client_id: dto.client_id,
      project_id: dto.project_id,
      operator_id: user.id,
    }).instance;

    const connection = await this._connectionRepository.create(instance);
    connection.update({ operator: user });

    return connection;
  }

  public async disconnect(connection: MessengerConnectionAggregate) {
    const result = await this._connectionRepository.remove({
      filter: { field: 'id', value: connection.id },
    });
    return !!result.affected;
  }
}
