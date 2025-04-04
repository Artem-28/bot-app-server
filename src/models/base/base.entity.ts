import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity} from '@/models/base/base.interface';

export abstract class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  crated_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
