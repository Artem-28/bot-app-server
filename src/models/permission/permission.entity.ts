import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { PermissionEnum } from '@/providers/permission';

export const PERMISSION_TABLE = 'permissions';

@Entity({ name: PERMISSION_TABLE })
export class PermissionEntity {
  @PrimaryColumn({
    type: 'enum',
    enum: PermissionEnum,
    enumName: 'permission_enum',
    unique: true,
  })
  public code: PermissionEnum;

  @Column({
    name: 'parent_code',
    type: 'enum',
    enum: PermissionEnum,
    enumName: 'permission_enum',
    nullable: true,
  })
  public parentCode: PermissionEnum;

  @Column()
  public title: string;

  @OneToMany(() => PermissionEntity, (permission) => permission.parent)
  public children: PermissionEntity[];

  @ManyToOne(() => PermissionEntity, (permission) => permission.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_code' })
  public parent: PermissionEntity;
}
