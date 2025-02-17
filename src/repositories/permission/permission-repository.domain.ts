import { IPermission, PermissionAggregate } from '@/models/permission';
import { BuilderOptionsDto } from '@/common/utils/builder';

export abstract class PermissionRepositoryDomain {
  abstract getMany(
    options: BuilderOptionsDto<IPermission>,
  ): Promise<PermissionAggregate[]>;
}
