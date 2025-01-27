import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ConfirmCodeRepositoryDomain } from '@/repositories/confirm-code';
import { BaseRepository } from '@/repositories/base.repository';
import { FilterDto } from '@/common/dto';
import {
  ConfirmCodeAggregate,
  IConfirmCode,
  ConfirmCodeEntity,
} from '@/models/confirm-code';
import { HQueryBuilder } from '@/common/utils/database';

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
    filter: FilterDto<IConfirmCode> | FilterDto<IConfirmCode>[],
  ): Promise<ConfirmCodeAggregate | null> {
    const repository = this.getRepository(ConfirmCodeEntity);
    const query = new HQueryBuilder(repository, { filter: filter });

    const result = await query.builder.getOne();
    if (!result) return null;
    return ConfirmCodeAggregate.create(result);
  }

  public async remove(id: number): Promise<boolean> {
    const result = await this.getRepository(ConfirmCodeEntity)
      .createQueryBuilder()
      .delete()
      .where({ id })
      .execute();
    return !!result.affected;
  }
}
