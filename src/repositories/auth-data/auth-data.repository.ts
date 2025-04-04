import { BaseRepository } from '@/repositories/base.repository';
import { AuthDataDomain } from '@/repositories/auth-data/auth-data.domain';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import {
  AuthDataAggregate,
  AuthDataEntity,
  IAuthData,
} from '@/models/auth-data';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';

export class AuthDataRepository
  extends BaseRepository
  implements AuthDataDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }

  public async create(authData: IAuthData) {
    const result = await this.getRepository(AuthDataEntity).save(authData);
    return AuthDataAggregate.create(result);
  }

  public async getOne(options?: BuilderOptionsDto<IAuthData>) {
    const repository = this.getRepository(AuthDataEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return AuthDataAggregate.create(result);
  }

  public async update(id: number, data: Partial<IAuthData>) {
    const result = await this.getRepository(AuthDataEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where({ id })
      .execute();

    return !!result.affected;
  }

  public async exist(login: string) {
    const repository = this.getRepository(AuthDataEntity);
    const query = HQueryBuilder.select(repository, {
      filter: { field: 'login', value: login },
    });

    return await query.builder.getExists();
  }
}
