import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RespondentEntity } from '@/models/respondent';
import { SessionMode } from '@/models/message-session/message-session.interface';

export const MESSAGE_SESSION_TABLE = 'message_sessions';

@Entity({ name: MESSAGE_SESSION_TABLE })
export class MessageSessionEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'project_id' })
  public project_id: number;

  @Column({ name: 'script_id' })
  public script_id: number;

  @Column({ name: 'respondent_id' })
  public respondent_id: number;

  @Column({
    name: 'mode',
    type: 'enum',
    enum: SessionMode,
    enumName: 'session_mode',
  })
  public mode: SessionMode;

  @Column({ name: 'close_at', nullable: true })
  public close_at: Date | null;

  @Column({ name: 'last_active_at', nullable: true })
  public last_active_at: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @ManyToOne(() => RespondentEntity, (respondent) => respondent.id, {
    eager: true,
  })
  @JoinColumn({ name: 'respondent_id', referencedColumnName: 'id' })
  public respondent: RespondentEntity;
}
