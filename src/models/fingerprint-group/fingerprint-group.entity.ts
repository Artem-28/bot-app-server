import { Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { FingerprintEntity } from '@/models/fingerprint';

export const FINGERPRINT_GROUP_TABLE = 'fingerprint_groups';

@Entity({ name: FINGERPRINT_GROUP_TABLE })
export class FingerprintGroupEntity {
  @PrimaryColumn({ unique: true })
  public key: string;

  @OneToMany(
    () => FingerprintEntity,
    (fingerprint) => fingerprint.fingerprint_group,
    { cascade: true },
  )
  @JoinColumn({ name: 'key', referencedColumnName: 'group_key' })
  fingerprints: FingerprintEntity[];
}
