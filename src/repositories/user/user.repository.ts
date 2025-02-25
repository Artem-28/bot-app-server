import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { UserRepositoryDomain } from '@/repositories/user';
import { IUser, UserAggregate, UserEntity } from '@/models/user';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';

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
    options?: BuilderOptionsDto<IUser>,
  ): Promise<UserAggregate | null> {
    const repository = this.getRepository(UserEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return UserAggregate.create(result);
  }

  public async getMany(
    options?: BuilderOptionsDto<IUser>,
  ): Promise<UserAggregate[]> {
    const repository = this.getRepository(UserEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getMany();
    return result.map((data) => UserAggregate.create(data));
  }
}
