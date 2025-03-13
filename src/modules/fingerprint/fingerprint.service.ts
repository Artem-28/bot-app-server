import { Injectable } from '@nestjs/common';
import { FingerprintRepository } from '@/repositories/fingerprint/fingerprint.repository';
import { hGenerateCode } from '@/common/utils/generator';
import { FingerprintGroupAggregate } from '@/models/fingerprint-group/fingerprint-group.aggregate';
import { validate } from 'class-validator';

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

  public async createOrUpdateFingerprint(print: string) {
    const fingerprint = await this._fingerprintRepository.getFingerprint({
      filter: { field: 'fingerprint', value: print },
      relation: [{ name: 'fingerprintGroup', method: 'leftJoinAndSelect' }],
    });
    console.log('FINGERPRINT', fingerprint);
    // const groupKey = await this._generateGroupKey();
    // const groupInstance = FingerprintGroupAggregate.create({
    //   key: groupKey,
    //   fingerprints: [{ fingerprint: print }],
    // }).instance;
    // const fingerprintGroup =
    //   await this._fingerprintRepository.createOrUpdateFingerprint(
    //     groupInstance,
    //   );
    // console.log('GROUP_KEY', fingerprintGroup);
  }
}
