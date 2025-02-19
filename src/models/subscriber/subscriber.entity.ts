import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const SUBSCRIBER_TABLE = 'subscribers';

@Entity({ name: SUBSCRIBER_TABLE })
@Unique(['userId', 'projectId'])
export class SubscriberEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  public userId: number;

  @Column({ name: 'project_id' })
  public projectId: number;
}
