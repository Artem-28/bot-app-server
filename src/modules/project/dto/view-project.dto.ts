import { IsArray, IsDefined, IsNumber } from 'class-validator';
import { UserPermissionAggregate } from '@/models/user-permission';

export class ViewProjectDto {
  @IsDefined()
  @IsNumber()
  ownerId: number;

  @IsDefined()
  @IsArray()
  readProjectPermissions: UserPermissionAggregate[];
}
