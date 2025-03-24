import { Injectable } from '@nestjs/common';
import { ConnectionDto } from '@/modules/messenger/dto';
import { FingerprintService } from '@/modules/fingerprint';
import { RespondentService } from '@/modules/respondent';
import { ScriptRepository } from '@/repositories/script';
import { CommonError, errors } from '@/common/error';
import { MessageSessionRepository } from '@/repositories/message-session';
import { MessageSessionAggregate } from '@/models/message-session';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MessengerService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _fingerprintService: FingerprintService,
    private readonly _respondentService: RespondentService,
    private readonly _scriptRepository: ScriptRepository,
    private readonly _messageSessionRepository: MessageSessionRepository,
  ) {}

  public async getConnectionData(dto: ConnectionDto) {
    // Получаем скрипт
    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: dto.scriptId },
        { field: 'projectId', value: dto.projectId, operator: 'and' },
      ],
    });
    // Если скрипт не был найден возврашаем ошибку
    if (!script) {
      throw new CommonError({ messages: errors.messenger.connect });
    }

    // Получаем отпечатки пользователя
    const data = await this._fingerprintService.getFingerprint(
      dto.fingerprint,
      true,
    );
    const fingerprint = data.map((item) => item.fingerprint);

    // Идентифицируем пользователя по отпечаткам
    let respondent = await this._respondentService.respondentIdentity(
      dto.projectId,
      fingerprint,
    );
    let session: MessageSessionAggregate | null = null;
    // Если не удалось идентифицировать пользователя
    if (!respondent) {
      // Создаем пользователя с отпечатком
      respondent = await this._respondentService.create({
        projectId: dto.projectId,
        name: 'respondent.new',
        fingerprints: [dto.fingerprint],
      });
      // Создаем новую сессию для нового пользователя
      session = await this._messageSessionRepository.create(
        MessageSessionAggregate.create({
          projectId: dto.projectId,
          scriptId: dto.scriptId,
          respondentId: respondent.id,
          title: script.title,
        }).instance,
      );
    }

    // Если сессии нет то пользователь был идентифицирован
    if (!session) {
      // Ищем последнюю активную сессиию
      session = await this._messageSessionRepository.getOne({
        filter: [
          { field: 'projectId', value: dto.projectId },
          { field: 'scriptId', value: dto.scriptId, operator: 'and' },
          { field: 'respondentId', value: respondent.id, operator: 'and' },
        ],
      });
    }

    // Если не нашли активной сессии
    if (!session) {
      // Создаем сессию для идентифицированного пользователя
      session = await this._messageSessionRepository.create(
        MessageSessionAggregate.create({
          projectId: dto.projectId,
          scriptId: dto.scriptId,
          respondentId: respondent.id,
          title: script.title,
        }),
      );
    }
    return { token: this._getSessionToken(session) };
  }

  private _getSessionToken(session: MessageSessionAggregate) {
    return this._jwtService.sign({
      sessionId: session.id,
      projectId: session.projectId,
      scriptId: session.scriptId,
      respondentId: session.respondentId,
    });
  }
}
