import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const RESPONDENT_TABLE = 'respondents';

@Entity({ name: RESPONDENT_TABLE })
export class RespondentEntity extends BaseEntity {
  @Column({ name: 'project_id' })
  public projectId: number;

  @Column({ nullable: true })
  public name: string | null;

  @Column({ nullable: true })
  public surname: string | null;

  @Column({ nullable: true })
  public patronymic: string | null;

  @Column({ nullable: true, unique: true })
  public email: string | null;

  @Column({ nullable: true, unique: true })
  public phone: string | null;
}
