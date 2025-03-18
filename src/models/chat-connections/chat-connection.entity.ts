import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const CHAT_CONNECTION_TABLE = 'chat_connections';

@Entity({ name: CHAT_CONNECTION_TABLE })
export class ChatConnectionEntity extends BaseEntity {
  @Column()
  public key: string;

  @Column({ name: 'project_id' })
  public projectId: number;

  @Column({ name: 'script_id', nullable: true })
  public scriptId: number | null;

  @Column({ name: 'respondent_id', nullable: true })
  public respondentId: number | null;

  @Column({ name: 'user_id', nullable: true })
  public userId: number | null;

  @Column({ name: 'socket_id', nullable: true })
  public socketId: string | null;

  @Column()
  public connected: boolean;
}
