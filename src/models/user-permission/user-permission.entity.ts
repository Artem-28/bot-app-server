import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { PermissionEnum } from '@/providers/permission';
import { PermissionEntity } from '@/models/permission/permission.entity';

export const USER_PERMISSION_TABLE = 'user_permissions';

@Entity({ name: USER_PERMISSION_TABLE })
@Unique(['user_id', 'project_id', 'code'])
export class UserPermissionEntity {
  @PrimaryColumn({ name: 'user_id' })
  public user_id: number;

  @PrimaryColumn({ name: 'project_id' })
  public project_id: number;

  @PrimaryColumn({
    type: 'enum',
    enum: PermissionEnum,
    enumName: 'permission_enum',
  })
  public code: PermissionEnum;

  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.user_permissions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'code' })
  public permission: PermissionEntity;
}
