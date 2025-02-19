import { PermissionEnum } from '@/providers/permission';
import { IsArray, IsDefined, IsNumber } from 'class-validator';

export class UpdatePermissionDto {
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsDefined()
  @IsNumber()
  userId: number;

  @IsDefined()
  @IsArray()
  permissions: PermissionEnum[];
}

export class updatePermissionBodyDto {
  @IsDefined()
  @IsArray()
  permissions: PermissionEnum[];
}
