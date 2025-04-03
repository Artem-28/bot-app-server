import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/models/base';
import { RespondentEntity } from '@/models/respondent';

export const MESSAGE_SESSION_TABLE = 'message_sessions';

@Entity({ name: MESSAGE_SESSION_TABLE })
export class MessageSessionEntity extends BaseEntity {
  @Column({ name: 'project_id' })
  public project_id: number;

  @Column({ name: 'script_id' })
  public script_id: number;

  @Column({ name: 'respondent_id' })
  public respondent_id: number;

  @Column()
  public title: string;

  @Column({ name: 'end_at', nullable: true })
  public end_at: Date | null;

  @ManyToOne(() => RespondentEntity, (respondent) => respondent.id, {
    eager: true,
  })
  @JoinColumn({ name: 'respondent_id', referencedColumnName: 'id' })
  respondent: RespondentEntity;
}
