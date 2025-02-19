import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ConfirmCodeRepositoryDomain } from '@/repositories/confirm-code';
import { BaseRepository } from '@/repositories/base.repository';
import {
  ConfirmCodeAggregate,
  IConfirmCode,
  ConfirmCodeEntity,
} from '@/models/confirm-code';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';

@Injectable({ scope: Scope.REQUEST })
export class ConfirmCodeRepository
  extends BaseRepository
  implements ConfirmCodeRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
    super(dataSource, request);
  }

  public async create(
    confirmCode: IConfirmCode,
  ): Promise<ConfirmCodeAggregate> {
    const result =
      await this.getRepository(ConfirmCodeEntity).save(confirmCode);
    return ConfirmCodeAggregate.create(result);
  }

  public async update(
    id: number,
    data: Partial<IConfirmCode>,
  ): Promise<boolean> {
    const result = await this.getRepository(ConfirmCodeEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where({ id })
      .execute();
    return !!result.affected;
  }

  public async getOne(
    options?: BuilderOptionsDto<IConfirmCode>,
  ): Promise<ConfirmCodeAggregate | null> {
    const repository = this.getRepository(ConfirmCodeEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return ConfirmCodeAggregate.create(result);
  }

  public async remove(id: number): Promise<boolean> {
    const repository = this.getRepository(ConfirmCodeEntity);
    const query = HQueryBuilder.delete(repository, {
      filter: { field: 'id', value: id },
    });

    const result = await query.builder.execute();
    return !!result.affected;
  }
}
