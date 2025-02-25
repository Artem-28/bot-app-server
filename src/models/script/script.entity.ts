import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const SCRIPT_TABLE = 'scripts';

@Entity({ name: SCRIPT_TABLE })
export class ScriptEntity extends BaseEntity {
  @Column({ name: 'project_id' })
  public projectId: number;

  @Column()
  public title: string;
}
