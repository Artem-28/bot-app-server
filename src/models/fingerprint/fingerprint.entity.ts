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
  public groupKey: string;

  @Column({ name: 'last_active_at' })
  public lastActiveAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    () => FingerprintGroupEntity,
    (fingerprintGroup) => fingerprintGroup.fingerprints,
    { eager: true },
  )
  @JoinColumn({ name: 'group_key', referencedColumnName: 'key' })
  fingerprintGroup: FingerprintGroupEntity;
}
