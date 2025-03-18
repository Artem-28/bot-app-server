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
@Unique(['userId', 'projectId', 'code'])
export class UserPermissionEntity {
  @PrimaryColumn({ name: 'user_id' })
  public userId: number;

  @PrimaryColumn({ name: 'project_id' })
  public projectId: number;

  @PrimaryColumn({
    type: 'enum',
    enum: PermissionEnum,
    enumName: 'permission_enum',
  })
  public code: PermissionEnum;

  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.userPermissions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'code' })
  public permission: PermissionEntity;
}
