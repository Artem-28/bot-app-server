import { Injectable } from '@nestjs/common';
import { RespondentRepository } from '@/repositories/respondent';
import {
  CreateRespondentDto,
  UpdateRespondentDto,
} from '@/modules/respondent/dto';
import { RespondentAggregate } from '@/models/respondent';
import { CommonError, errors } from '@/common/error';
import { IRespondentFingerprint } from '@/models/respondent-fingerprint';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';
import { hToArray } from '@/common/utils/formatter';
import { ParamProject, ParamRespondent } from '@/common/param';

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

  public projectRespondents(param: ParamProject) {
    return this._respondentRepository.getMany({
      filter: { field: 'project_id', value: param.project_id },
    });
  }

  public async update(param: ParamRespondent, dto: UpdateRespondentDto) {
    const respondent = await this._respondentRepository.getOne({
      filter: [
        { field: 'id', value: param.respondent_id },
        { field: 'project_id', value: param.project_id, operator: 'and' },
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

  public async getRespondent(id: number, projectId: number) {
    return this._respondentRepository.getOne({
      filter: [
        { field: 'id', value: id },
        { field: 'project_id', value: projectId },
      ],
    });
  }

  public async respondentIdentity(
    projectId: number,
    fingerprint: string | string[],
  ) {
    const respondentFingerprint = await this._fingerprintRepository.getOne({
      filter: [
        { field: 'project_id', value: projectId },
        { field: 'fingerprint', value: fingerprint, operator: 'and' },
      ],
    });
    if (!respondentFingerprint) {
      return this.create({
        project_id: projectId,
        name: 'respondent.new',
        fingerprints: hToArray(fingerprint),
      });
    }

    return this._respondentRepository.getOne({
      filter: { field: 'id', value: respondentFingerprint.respondent_id },
    });
  }
}
