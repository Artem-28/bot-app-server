import { Injectable } from '@nestjs/common';
import { FingerprintRepository } from '@/repositories/fingerprint/fingerprint.repository';
import { hGenerateCode } from '@/common/utils/generator';
import { FingerprintGroupAggregate } from '@/models/fingerprint-group/fingerprint-group.aggregate';
import { hToArray } from '@/common/utils/formatter';

@Injectable()
export class FingerprintService {
  constructor(private readonly _fingerprintRepository: FingerprintRepository) {}

  private async _generateGroupKey() {
    let key: string;
    let exists: boolean;

    do {
      key = hGenerateCode('*****-*****-*****-*****');
      exists = await this._fingerprintRepository.existKey(key);
    } while (exists);

    return key;
  }

  public async createFingerprintGroup(print: string[] | string) {
    const fingerprints = hToArray(print).map((item) => ({ fingerprint: item }));
    const key = await this._generateGroupKey();
    const instance = FingerprintGroupAggregate.create({
      key,
      fingerprints,
    });
    return this._fingerprintRepository.createFingerprintGroup(instance);
  }

  public async getFingerprint(print: string, full = false) {
    const fingerprint = await this._fingerprintRepository.getFingerprint({
      filter: { field: 'fingerprint', value: print },
    });

    if (!fingerprint) {
      const group = await this.createFingerprintGroup(print);
      return group.fingerprints;
    }

    fingerprint.activity();
    await this._fingerprintRepository.updateFingerprint(
      print,
      fingerprint.instance,
    );

    if (!full) return [fingerprint];

    const group = await this._fingerprintRepository.getFingerprintGroup(
      fingerprint.group_key,
    );
    if (!group) return [fingerprint];
    return group.fingerprints;
  }
}
