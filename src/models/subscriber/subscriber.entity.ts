import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
} from 'typeorm';

export const SUBSCRIBER_TABLE = 'subscribers';

@Entity({ name: SUBSCRIBER_TABLE })
@Unique(['user_id', 'project_id'])
export class SubscriberEntity {
  @PrimaryColumn({ name: 'user_id' })
  public user_id: number;

  @PrimaryColumn({ name: 'project_id' })
  public project_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
