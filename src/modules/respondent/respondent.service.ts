import { Injectable } from '@nestjs/common';
import { RespondentRepository } from '@/repositories/respondent';
import { IProjectParam, IRespondentParam } from '@/common/types';
import {
  CreateRespondentDto,
  UpdateRespondentDto,
} from '@/modules/respondent/dto';
import { RespondentAggregate } from '@/models/respondent';
import { CommonError, errors } from '@/common/error';
import { IRespondentFingerprint } from '@/models/respondent-fingerprint';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';

@Injectable()
export class RespondentService {
  constructor(
    private readonly _respondentRepository: RespondentRepository,
    private readonly _fingerprintRepository: RespondentFingerprintRepository,
  ) {}

  public create(dto: CreateRespondentDto) {
    const fingerprints: Partial<IRespondentFingerprint>[] = [];
    if (dto.fingerprints) {
      dto.fingerprints.forEach((fingerprint) => {
        fingerprints.push({ fingerprint });
      });
    }
    const respondent = RespondentAggregate.create({
      ...dto,
      fingerprints,
    });
    return this._respondentRepository.create(respondent);
  }

  public projectRespondents(param: IProjectParam) {
    return this._respondentRepository.getMany({
      filter: { field: 'projectId', value: param.projectId },
    });
  }

  public async update(param: IRespondentParam, dto: UpdateRespondentDto) {
    const respondent = await this._respondentRepository.getOne({
      filter: [
        { field: 'id', value: param.respondentId },
        { field: 'projectId', value: param.projectId, operator: 'and' },
      ],
    });

    if (!respondent) {
      throw new CommonError({ messages: errors.respondent.not_found });
    }

    const isEmptyDto = Object.keys(dto).length === 0;
    if (isEmptyDto) return respondent;

    respondent.update(dto);

    const result = await this._respondentRepository.update(
      respondent.id,
      respondent.instance,
    );

    const success = !!result.affected;
    if (!success) {
      throw new CommonError({ messages: errors.respondent.update });
    }

    return respondent;
  }

  public async respondentIdentity(
    projectId: number,
    fingerprint: string | string[],
  ) {
    const respondentFingerprint = await this._fingerprintRepository.getOne({
      filter: [
        { field: 'projectId', value: projectId },
        { field: 'fingerprint', value: fingerprint, operator: 'and' },
      ],
    });
    if (!respondentFingerprint) return null;

    return this._respondentRepository.getOne({
      filter: { field: 'id', value: respondentFingerprint.respondentId },
    });
  }
}
