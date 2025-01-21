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
}
