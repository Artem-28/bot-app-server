import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource, DeleteResult } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { UserPermissionRepositoryDomain } from '@/repositories/user-permission/user-permission-repository.domain';
import {
  IUserPermission,
  UserPermissionAggregate,
  UserPermissionEntity,
} from '@/models/user-permission';
import {
  BuilderFilterDto,
  BuilderOptionsDto, DeleteBuilderOptions,
  HQueryBuilder,
} from '@/common/utils/builder';

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
    options?: DeleteBuilderOptions<IUserPermission>
  ): Promise<DeleteResult> {
    const repository = this.getRepository(UserPermissionEntity);
    const query = HQueryBuilder.delete(repository, options);
    return await query.builder.execute();
  }

  async getMany(
    options?: BuilderOptionsDto<IUserPermission>,
  ): Promise<UserPermissionAggregate[]> {
    const repository = this.getRepository(UserPermissionEntity);
    const query = HQueryBuilder.select(repository, options);
    const result = await query.builder.getMany();
    return result.map((item) => UserPermissionAggregate.create(item));
  }
}
