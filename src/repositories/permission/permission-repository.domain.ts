import { IPermission, PermissionAggregate } from '@/models/permission';
import { BuilderOptionsDto } from '@/common/utils/database';

export abstract class PermissionRepositoryDomain {
  abstract getMany(
    options: BuilderOptionsDto<IPermission>,
  ): Promise<PermissionAggregate[]>;
}
