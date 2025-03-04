import {
  BuilderOptionsDto,
  DeleteBuilderOptions,
} from '@/common/utils/builder';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IRespondent, RespondentAggregate } from '@/models/respondent';

export abstract class RespondentRepositoryDomain {
  abstract create(data: IRespondent): Promise<RespondentAggregate>;

  abstract update(
    id: number,
    data: Partial<IRespondent>,
  ): Promise<UpdateResult>;

  abstract getOne(
    options?: BuilderOptionsDto<IRespondent>,
  ): Promise<RespondentAggregate | null>;

  abstract getMany(
    options?: BuilderOptionsDto<IRespondent>,
  ): Promise<RespondentAggregate[]>;

  abstract remove(
    options: DeleteBuilderOptions<IRespondent>,
  ): Promise<DeleteResult>;
}
