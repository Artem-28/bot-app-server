import { Injectable } from '@nestjs/common';
import { ConnectionDto } from '@/modules/widget/dto';
import { JwtService } from '@nestjs/jwt';
import { ScriptRepository } from '@/repositories/script';
import { CommonError, errors } from '@/common/error';
import { RespondentService } from '@/modules/respondent';
import { hToArray } from '@/common/utils/formatter';
import { MessageSessionRepository } from '@/repositories/message-session';
import { MessageRepository } from '@/repositories/message';
import { UserAggregate } from '@/models/user';
import { UserRepository } from '@/repositories/user';

@Injectable()
export class WidgetService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _scriptRepository: ScriptRepository,
    private readonly _respondentService: RespondentService,
    private readonly _messageSessionRepository: MessageSessionRepository,
    private readonly _messageRepository: MessageRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async startData(script_id: number) {
    // Получаем скрипт
    const script = await this._scriptRepository.getOne({
      filter: { field: 'id', value: script_id },
    });

    // Если скрипт не был найден возврашаем ошибку
    if (!script) {
      throw new CommonError({ messages: errors.messenger.connect });
    }

    return script;
  }

  public async connection(dto: ConnectionDto) {
    // Получаем скрипт
    const script = await this._scriptRepository.getOne({
      filter: { field: 'id', value: dto.script_id },
    });

    // Если скрипт не был найден возврашаем ошибку
    if (!script) {
      throw new CommonError({ messages: errors.messenger.connect });
    }

    // Идентифицируем пользователя по отпечаткам
    let respondent = await this._respondentService.respondentIdentity(
      script.project_id,
      dto.fingerprint,
    );

    if (!respondent) {
      respondent = await this._respondentService.create({
        project_id: script.project_id,
        fingerprints: hToArray(dto.fingerprint),
      });
    }

    return this._jwtService.sign({
      respondent_id: respondent.id,
      script_id: script.id,
      project_id: script.project_id,
    });
  }

  public async getHistory(dto: ConnectionDto) {
    // Получаем скрипт
    const script = await this._scriptRepository.getOne({
      filter: { field: 'id', value: dto.script_id },
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

    if (!respondent) return [];

    const session = await this._messageSessionRepository.lastActiveSession({
      filter: [
        { field: 'script_id', value: script.id },
        { field: 'respondent_id', value: respondent.id },
      ],
    });

    if (!session) return [];

    const operatorIds = new Set<number>();
    const operatorMap = new Map<number, UserAggregate>();

    const messages = await this._messageRepository.getMany({
      filter: { field: 'session_id', value: session.id },
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
