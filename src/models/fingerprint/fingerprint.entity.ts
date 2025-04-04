import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { FingerprintGroupEntity } from '@/models/fingerprint-group';

export const FINGERPRINT_TABLE = 'fingerprints';

@Entity({ name: FINGERPRINT_TABLE })
export class FingerprintEntity {
  @PrimaryColumn({ unique: true })
  public fingerprint: string;

  @PrimaryColumn({ name: 'group_key' })
  public group_key: string;

  @Column({ name: 'last_active_at' })
  public last_active_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToOne(
    () => FingerprintGroupEntity,
    (fingerprintGroup) => fingerprintGroup.fingerprints,
    { eager: true },
  )
  @JoinColumn({ name: 'group_key', referencedColumnName: 'key' })
  fingerprint_group: FingerprintGroupEntity;
}
