import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { IPermission } from '@/models/permission/permission.interface';
import { PermissionEnum } from '@/providers/permission';

export class PermissionAggregate implements IPermission {
  @IsDefined()
  @IsEnum(PermissionEnum)
  code: PermissionEnum;

  @IsEnum(PermissionEnum)
  @IsOptional()
  parentCode: PermissionEnum = null;

  @IsDefined()
  @IsString()
  title: string;

  @IsOptional()
  children: PermissionAggregate[] = [];

  static create({ children, ...data }: Partial<IPermission>) {
    const _resource = new PermissionAggregate();
    Object.assign(_resource, data);
    if (children && children.length) {
      _resource.children = children.map((item) => PermissionAggregate.create(item))
    }

    const errors = validateSync(_resource, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }

    return _resource;
  }

  get instance(): IPermission {
    return {
      code: this.code,
      parentCode: this.parentCode,
      title: this.title,
    };
  }
}
