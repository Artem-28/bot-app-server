import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const PROJECT_TABLE = 'projects';

@Entity({ name: PROJECT_TABLE })
export class ProjectEntity extends BaseEntity {
  @Column({ name: 'owner_id' })
  public ownerId: number;

  @Column()
  public title: string;
}
