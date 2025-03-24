import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const MESSAGE_SESSION_TABLE = 'message_sessions';

@Entity({ name: MESSAGE_SESSION_TABLE })
export class MessageSessionEntity extends BaseEntity {
  @Column({ name: 'project_id' })
  public projectId: number;

  @Column({ name: 'script_id' })
  public scriptId: number;

  @Column({ name: 'respondent_id' })
  public respondentId: number;

  @Column()
  public title: string;

  @Column({ name: 'end_at', nullable: true })
  public endAt: Date | null;
}
