import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { UserRepositoryDomain } from '@/repositories/user';
import { IUser, UserAggregate, UserEntity } from '@/models/user';
import { FilterDto } from '@/common/dto';
import { HQueryBuilder } from '@/common/utils/database';

@Injectable()
export class UserRepository
  extends BaseRepository
  implements UserRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }

  public async create(user: IUser) {
    const result = await this.getRepository(UserEntity).save(user);
    return UserAggregate.create(result);
  }

  public async getOne(
    filter: FilterDto<IUser> | FilterDto<IUser>[],
  ): Promise<UserAggregate | null> {
    const repository = this.getRepository(UserEntity);
    const query = new HQueryBuilder(repository, { filter: filter });

    const result = await query.builder.getOne();
    if (!result) return null;
    return UserAggregate.create(result);
  }
}
