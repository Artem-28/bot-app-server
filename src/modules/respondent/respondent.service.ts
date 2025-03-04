import { Injectable } from '@nestjs/common';
import { RespondentRepository } from '@/repositories/respondent';
import { IProjectParam, IRespondentParam } from '@/common/types';
import { UpdateRespondentDto } from '@/modules/respondent/dto';
import { RespondentAggregate } from '@/models/respondent';
import { CommonError, errors } from '@/common/error';

@Injectable()
export class RespondentService {
  constructor(private readonly _respondentRepository: RespondentRepository) {}

  public create(param: IProjectParam, dto: UpdateRespondentDto) {
    const respondent = RespondentAggregate.create({
      projectId: Number(param.projectId),
      ...dto,
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
}
