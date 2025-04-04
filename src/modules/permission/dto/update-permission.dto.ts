import { PermissionEnum } from '@/providers/permission';
import { IsArray, IsDefined, IsNumber } from 'class-validator';

export class UpdatePermissionDto {
  @IsDefined()
  @IsNumber()
  project_id: number;

  @IsDefined()
  @IsNumber()
  user_id: number;

  @IsDefined()
  @IsArray()
  permissions: PermissionEnum[];
}

export class updatePermissionBodyDto {
  @IsDefined()
  @IsArray()
  permissions: PermissionEnum[];
}
