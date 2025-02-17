import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { PermissionEnum } from '@/providers/permission';
import { IUserPermission } from '@/models/user-permission/user-permission.interface';

export class UserPermissionAggregate implements IUserPermission {
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsDefined()
  @IsNumber()
  userId: number;

  @IsDefined()
  @IsEnum(PermissionEnum)
  code: PermissionEnum;

  static create(data: Partial<IUserPermission>) {
    const _resource = new UserPermissionAggregate();
    Object.assign(_resource, data);

    const errors = validateSync(_resource, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }

    return _resource;
  }

  get instance(): IUserPermission {
    return {
      userId: this.userId,
      projectId: this.projectId,
      code: this.code,
    };
  }
}
