import { IFingerprintGroup } from '@/models/fingerprint-group';
import { FingerprintGroupAggregate } from '@/models/fingerprint-group/fingerprint-group.aggregate';
import { BuilderOptionsDto } from '@/common/utils/builder';
import { FingerprintAggregate, IFingerprint } from '@/models/fingerprint';
import { UpdateResult } from 'typeorm';

export abstract class FingerprintRepositoryDomain {
  abstract createFingerprintGroup(
    data: IFingerprintGroup,
  ): Promise<FingerprintGroupAggregate>;

  abstract getFingerprintGroup(key: string): Promise<FingerprintGroupAggregate>;

  abstract getFingerprint(
    options?: BuilderOptionsDto<IFingerprint>,
  ): Promise<FingerprintAggregate | null>;

  abstract updateFingerprint(
    print: string,
    data: Partial<IFingerprint>,
  ): Promise<UpdateResult>;

  abstract existKey(key: string): Promise<boolean>;

  // abstract getGroupFingerprint(
  //   print: string,
  // ): Promise<FingerprintGroupAggregate>;
}
