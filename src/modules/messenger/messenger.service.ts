import { Injectable } from '@nestjs/common';
import {
  CreateMessageDto,
  OperatorConnectionDto,
  RespondentConnectionDto,
  SessionDto,
} from '@/modules/messenger/dto';
import { RespondentService } from '@/modules/respondent';
import { ScriptRepository } from '@/repositories/script';
import { CommonError, errors } from '@/common/error';
import { MessageSessionRepository } from '@/repositories/message-session';
import { MessageSessionAggregate, SessionMode } from '@/models/message-session';
import { JwtService } from '@nestjs/jwt';
import { MessengerConnectionRepository } from '@/repositories/messenger-connection';
import { MessengerConnectionAggregate } from '@/models/messenger-connection';
import { UserRepository } from '@/repositories/user';
import {
  AuthorMessageType,
  IMessage,
  MessageAggregate,
} from '@/models/message';
import { MessageRepository } from '@/repositories/message';
import {
  IMessengerGroup,
  MessengerGroupAggregate,
} from '@/models/messenger-group';
import { ScriptAggregate } from '@/models/script';
import { RespondentAggregate } from '@/models/respondent';
import { UserAggregate } from '@/models/user';

@Injectable()
export class MessengerService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _respondentService: RespondentService,
    private readonly _userRepository: UserRepository,
    private readonly _scriptRepository: ScriptRepository,
    private readonly _messageSessionRepository: MessageSessionRepository,
    private readonly _messageRepository: MessageRepository,
    private readonly _connectionRepository: MessengerConnectionRepository,
  ) {}

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
      mode: SessionMode.OPERATOR,
    }).instance;

    session = await this._messageSessionRepository.create(session_instance);
    session.setRespondent(respondent);
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
    connection.setOperator(user);

    return connection;
  }

  public async disconnect(connection: MessengerConnectionAggregate) {
    const result = await this._connectionRepository.remove({
      filter: { field: 'id', value: connection.id },
    });
    return !!result.affected;
  }

  public async createMessage(dto: CreateMessageDto) {
    const data: Partial<IMessage> = {
      author_type: AuthorMessageType.RESPONDENT,
    };

    if (dto.text) data.text = dto.text;

    if (dto.operator_id) {
      data.author_type = AuthorMessageType.OPERATOR;
      data.operator_id = dto.operator_id;
    }

    const session = await this._messageSessionRepository.getOne({
      filter: { field: 'id', value: dto.session_id },
    });

    if (!session) {
      throw new CommonError({ messages: 'error.session.not_found' });
    }

    data.session_id = session.id;

    const message = await this._messageRepository.create(
      MessageAggregate.create(data).instance,
    );

    session.active();
    await this._messageSessionRepository.update(session.id, session.instance);

    message.setSession(session);

    return message;
  }

  public async getMessengers(project_id: number) {
    const scriptIds = new Set<number>();
    const sessionIds = new Set<number>();
    const respondentIds = new Set<number>();
    const operatorIds = new Set<number>();

    const scriptMap = new Map<number, ScriptAggregate>();
    const sessionLastMessageMap = new Map<number, MessageAggregate>();
    const respondentMap = new Map<number, RespondentAggregate>();
    const operatorMap = new Map<number, UserAggregate>();

    const sessions =
      await this._messageSessionRepository.lastActiveSessions(project_id);

    sessions.forEach((session) => {
      sessionIds.add(session.id);
      scriptIds.add(session.script_id);
      respondentIds.add(session.respondent_id);
    });

    const respondents = await this._respondentService.respondents([
      ...respondentIds,
    ]);

    const messages = await this._messageRepository.lastMessages([
      ...sessionIds,
    ]);

    const scripts = await this._scriptRepository.getMany({
      filter: { field: 'id', value: [...scriptIds] },
    });

    respondents.forEach((respondent) => {
      respondentMap.set(respondent.id, respondent);
    });

    scripts.forEach((script) => {
      scriptMap.set(script.id, script);
    });

    messages.forEach((message) => {
      operatorIds.add(message.operator_id);
      sessionLastMessageMap.set(message.session_id, message);
    });

    const operators = await this._userRepository.getMany({
      filter: { field: 'id', value: [...operatorIds] },
    });

    operators.forEach((operator) => {
      operatorMap.set(operator.id, operator);
    });

    return sessions.map((session) => {
      const message = sessionLastMessageMap.get(session.id);
      const operator = operatorMap.get(message?.operator_id);
      const respondent = respondentMap.get(session.respondent_id);
      const script = scriptMap.get(session.script_id);

      if (operator) message.setOperator(operator);
      if (respondent) session.setRespondent(respondent);
      if (message) session.appendMessage(message);

      const data: IMessengerGroup = {
        id: session.script_id,
        title: 'remove.script',
        sessions: [session],
      };

      if (script) data.title = script.title;

      return MessengerGroupAggregate.create(data);
    });
  }

  public async activeSessions(script_id: number) {
    const sessionIds = new Set<number>();
    const respondentIds = new Set<number>();
    const operatorIds = new Set<number>();

    const respondentMap = new Map<number, RespondentAggregate>();
    const sessionLastMessageMap = new Map<number, MessageAggregate>();
    const operatorMap = new Map<number, UserAggregate>();

    const sessions = await this._messageSessionRepository.getMany({
      filter: [
        { field: 'script_id', value: script_id },
        { field: 'last_active_at', value: 'IS NOT NULL' },
      ],
    });

    sessions.forEach((session) => {
      sessionIds.add(session.id);
      respondentIds.add(session.respondent_id);
    });

    const respondents = await this._respondentService.respondents([
      ...respondentIds,
    ]);

    respondents.forEach((respondent) => {
      respondentMap.set(respondent.id, respondent);
    });

    const messages = await this._messageRepository.lastMessages([
      ...sessionIds,
    ]);

    messages.forEach((message) => {
      sessionLastMessageMap.set(message.session_id, message);
    });

    const operators = await this._userRepository.getMany({
      filter: { field: 'id', value: [...operatorIds] },
    });

    operators.forEach((operator) => {
      operatorMap.set(operator.id, operator);
    });

    sessions.forEach((session) => {
      const respondent = respondentMap.get(session.respondent_id);
      const message = sessionLastMessageMap.get(session.id);
      const operator = operatorMap.get(message?.operator_id);

      if (operator) message.setOperator(operator);
      if (respondent) session.setRespondent(respondent);
      if (message) session.appendMessage(message);
    });

    return sessions;
  }

  public async sessionHistory(session_id: number) {
    const operatorIds = new Set<number>();
    const operatorMap = new Map<number, UserAggregate>();

    const messages = await this._messageRepository.getMany({
      filter: { field: 'session_id', value: session_id },
    });

    messages.forEach((message) => {
      if (!message.operator_id) return;
      operatorIds.add(message.operator_id);
    });

    const operators = await this._userRepository.getMany({
      filter: { field: 'id', value: [...operatorIds] },
    });

    operators.forEach((operator) => {
      operatorMap.set(operator.id, operator);
    });

    messages.forEach((message) => {
      const operator = operatorMap.get(message.operator_id);
      if (operator) {
        message.setOperator(operator);
      }
    });

    return messages;
  }
}
