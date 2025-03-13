import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const CHAT_SESSION_TABLE = 'chat_sessions';

@Entity({ name: CHAT_SESSION_TABLE })
export class ChatSessionEntity extends BaseEntity {
  @Column({ name: 'project_id' })
  public projectId: number;

  @Column({ name: 'script_id' })
  public scriptId: number;

  @Column({ name: 'respondent_id' })
  public respondentId: number;

  @Column()
  public title: string;
}
