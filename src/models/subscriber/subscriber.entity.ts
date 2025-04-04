import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const SUBSCRIBER_TABLE = 'subscribers';

@Entity({ name: SUBSCRIBER_TABLE })
@Unique(['user_id', 'project_id'])
export class SubscriberEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  public user_id: number;

  @Column({ name: 'project_id' })
  public project_id: number;
}
