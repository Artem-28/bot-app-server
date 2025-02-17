import {
  IUserPermission,
  UserPermissionAggregate,
} from '@/models/user-permission';
import { BuilderFilterDto, BuilderOptionsDto } from '@/common/utils/builder';
import { DeleteResult } from 'typeorm';

export abstract class UserPermissionRepositoryDomain {
  abstract save(
    permissions: IUserPermission[],
  ): Promise<UserPermissionAggregate[]>;

  abstract remove(
    filter:
      | BuilderFilterDto<IUserPermission>
      | BuilderFilterDto<IUserPermission>[],
  ): Promise<DeleteResult>;

  abstract getMany(
    options?: BuilderOptionsDto<IUserPermission>,
  ): Promise<UserPermissionAggregate[]>;
}
