import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { UserPermissionRepositoryDomain } from '@/repositories/user-permission/user-permission-repository.domain';
import {
  IUserPermission,
  UserPermissionAggregate,
  UserPermissionEntity,
} from '@/models/user-permission';
import { BuilderFilterDto, HQueryBuilder } from '@/common/utils/database';

@Injectable()
export class UserPermissionRepository
  extends BaseRepository
  implements UserPermissionRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
    super(dataSource, request);
  }

  async save(
    permissions: IUserPermission[],
  ): Promise<UserPermissionAggregate[]> {
    const result =
      await this.getRepository(UserPermissionEntity).save(permissions);
    return result.map((item) => UserPermissionAggregate.create(item));
  }

  async remove(
    filter:
      | BuilderFilterDto<IUserPermission>
      | BuilderFilterDto<IUserPermission>[],
  ): Promise<boolean> {
    const repository = this.getRepository(UserPermissionEntity);
    const query = new HQueryBuilder(repository, {
      filter,
      deleteBuilder: true,
    });
    const result = await query.builder.execute();
    console.log('DELETE RESULT', result);
    return true;
  }
}
