import { IFingerprintGroup } from '@/models/fingerprint-group';
import { FingerprintGroupAggregate } from '@/models/fingerprint-group/fingerprint-group.aggregate';

export abstract class FingerprintRepositoryDomain {
  abstract createOrUpdateFingerprint(
    data: IFingerprintGroup,
  ): Promise<FingerprintGroupAggregate>;

  abstract existKey(key: string): Promise<boolean>;

  // abstract getGroupFingerprint(
  //   print: string,
  // ): Promise<FingerprintGroupAggregate>;
}
