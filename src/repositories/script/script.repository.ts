import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import {
  BuilderOptionsDto,
  DeleteBuilderOptions,
  HQueryBuilder,
} from '@/common/utils/builder';
import { ScriptRepositoryDomain } from '@/repositories/script/script-repository.domain';
import { IScript, ScriptAggregate, ScriptEntity } from '@/models/script';

@Injectable()
export class ScriptRepository
  extends BaseRepository
  implements ScriptRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
    super(dataSource, request);
  }

  async create(script: IScript): Promise<ScriptAggregate> {
    const result = await this.getRepository(ScriptEntity).save(script);
    return ScriptAggregate.create(result);
  }

  async getOne(
    options?: BuilderOptionsDto<IScript>,
  ): Promise<ScriptAggregate | null> {
    const repository = this.getRepository(ScriptEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return ScriptAggregate.create(result);
  }

  update(id: number, data: Partial<IScript>): Promise<UpdateResult> {
    return this.getRepository(ScriptEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where({ id })
      .execute();
  }

  remove(options: DeleteBuilderOptions<IScript>): Promise<DeleteResult> {
    const repository = this.getRepository(ScriptEntity);
    const query = HQueryBuilder.delete(repository, options);
    return query.builder.execute();
  }

  async getMany(
    options?: BuilderOptionsDto<IScript>,
  ): Promise<ScriptAggregate[]> {
    const repository = this.getRepository(ScriptEntity);
    const query = HQueryBuilder.select(repository, options);
    const result = await query.builder.getMany();
    if (!result) return null;
    return result.map((item) => ScriptAggregate.create(item));
  }
}
