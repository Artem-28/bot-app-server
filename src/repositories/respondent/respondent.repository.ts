import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import {
  BuilderOptionsDto,
  DeleteBuilderOptions,
  HQueryBuilder,
} from '@/common/utils/builder';
import { RespondentRepositoryDomain } from '@/repositories/respondent/respondent.repository.domain';
import {
  IRespondent,
  RespondentAggregate,
  RespondentEntity,
} from '@/models/respondent';

@Injectable()
export class RespondentRepository
  extends BaseRepository
  implements RespondentRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }

  async create(data: IRespondent): Promise<RespondentAggregate> {
    const respondent = await this.getRepository(RespondentEntity).save(data);
    return RespondentAggregate.create(respondent);
  }

  async getOne(
    options?: BuilderOptionsDto<IRespondent>,
  ): Promise<RespondentAggregate | null> {
    const repository = this.getRepository(RespondentEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return RespondentAggregate.create(result);
  }

  update(id: number, data: Partial<IRespondent>): Promise<UpdateResult> {
    return this.getRepository(RespondentEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where({ id })
      .execute();
  }

  remove(options: DeleteBuilderOptions<IRespondent>): Promise<DeleteResult> {
    const repository = this.getRepository(RespondentEntity);
    const query = HQueryBuilder.delete(repository, options);
    return query.builder.execute();
  }

  async getMany(
    options?: BuilderOptionsDto<IRespondent>,
  ): Promise<RespondentAggregate[]> {
    const repository = this.getRepository(RespondentEntity);
    const query = HQueryBuilder.select(repository, options);
    const result = await query.builder.getMany();
    if (!result) return null;
    return result.map((item) => RespondentAggregate.create(item));
  }
}
