import {
  IUserPermission,
  UserPermissionAggregate,
} from '@/models/user-permission';
import {
  BuilderOptionsDto,
  DeleteBuilderOptions,
} from '@/common/utils/builder';
import { DeleteResult } from 'typeorm';

export abstract class UserPermissionRepositoryDomain {
  abstract save(
    permissions: IUserPermission[],
  ): Promise<UserPermissionAggregate[]>;

  abstract remove(
    options?: DeleteBuilderOptions<IUserPermission>,
  ): Promise<DeleteResult>;

  abstract getMany(
    options?: BuilderOptionsDto<IUserPermission>,
  ): Promise<UserPermissionAggregate[]>;
}
