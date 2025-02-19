import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';
import { PermissionRepositoryDomain } from '@/repositories/permission/permission-repository.domain';
import {
  IPermission,
  PermissionAggregate,
  PermissionEntity,
} from '@/models/permission';

@Injectable()
export class PermissionRepository
  extends BaseRepository
  implements PermissionRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
    super(dataSource, request);
  }

  async getMany(
    options: BuilderOptionsDto<IPermission>,
  ): Promise<PermissionAggregate[]> {
    const repository = this.getRepository(PermissionEntity);
    const query = HQueryBuilder.select(repository, options);
    const result = await query.builder.getMany();
    return result.map((item) => PermissionAggregate.create(item));
  }
}
