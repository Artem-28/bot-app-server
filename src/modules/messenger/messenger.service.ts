import { Injectable } from '@nestjs/common';
import { ConnectionDto } from '@/modules/messenger/dto';
import { FingerprintService } from '@/modules/fingerprint';
import { RespondentService } from '@/modules/respondent';
import { ScriptRepository } from '@/repositories/script';
import { CommonError, errors } from '@/common/error';

@Injectable()
export class MessengerService {
  constructor(
    private readonly _fingerprintService: FingerprintService,
    private readonly _respondentService: RespondentService,
    private readonly _scriptRepository: ScriptRepository,
  ) {}

  public async getConnectionData(dto: ConnectionDto) {
    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: dto.scriptId },
        { field: 'projectId', value: dto.projectId, operator: 'and' },
      ],
    });
    if (!script) {
      throw new CommonError({ messages: errors.messenger.connect });
    }

    const data = await this._fingerprintService.getFingerprint(
      dto.fingerprint,
      true,
    );
    const fingerprint = data.map((item) => item.fingerprint);

    let respondent = await this._respondentService.respondentIdentity(
      dto.projectId,
      fingerprint,
    );
    if (!respondent) {
      respondent = await this._respondentService.create({
        projectId: dto.projectId,
        name: 'respondent.new',
        fingerprints: [dto.fingerprint],
      });
    }
    return respondent;
  }
}
