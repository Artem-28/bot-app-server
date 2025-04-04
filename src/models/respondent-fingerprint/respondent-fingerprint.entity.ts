import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { RespondentEntity } from '@/models/respondent';

export const RESPONDENT_FINGERPRINT_TABLE = 'respondent_fingerprints';

@Entity({ name: RESPONDENT_FINGERPRINT_TABLE })
export class RespondentFingerprintEntity {
  @PrimaryColumn({ name: 'respondent_id' })
  public respondent_id: number;

  @PrimaryColumn()
  public fingerprint: string;

  @Column({ name: 'project_id' })
  public project_id: number;

  @ManyToOne(() => RespondentEntity, (respondent) => respondent.fingerprints, {
    eager: true,
  })
  @JoinColumn({ name: 'respondent_id', referencedColumnName: 'id' })
  respondent: RespondentEntity;
}
