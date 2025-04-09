import { PermissionEnum } from '@/providers/permission';
import { IsArray, IsDefined } from 'class-validator';

export class UpdatePermissionDto {
  @IsDefined()
  @IsArray()
  permissions: PermissionEnum[];
}
