import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const MESSENGER_CONNECTION_TABLE = 'messenger_connections';

@Entity({ name: MESSENGER_CONNECTION_TABLE })
export class MessengerConnectionEntity extends BaseEntity {
  @Column()
  public client_id: string;

  @Column()
  public project_id: number;

  @Column({ nullable: true })
  public session_id: number | null;

  @Column({ nullable: true })
  public operator_id: number | null;
}
