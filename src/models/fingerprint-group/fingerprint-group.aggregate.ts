import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { IFingerprintGroup } from '@/models/fingerprint-group/fingerprint-group.interface';
import { FingerprintAggregate } from '@/models/fingerprint';

export class FingerprintGroupAggregate implements IFingerprintGroup {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  key: string;

  @IsOptional()
  fingerprints: FingerprintAggregate[];

  static create(data: Partial<IFingerprintGroup>) {
    const _entity = new FingerprintGroupAggregate();
    _entity.update(data);
    return _entity;
  }

  public update(data: Partial<IFingerprintGroup>) {
    const { fingerprints, ...param } = data;
    const entries = Object.entries(param);

    if (entries.length > 0) {
      entries.forEach(([key, value]) => {
        this[key] = value;
      });
    }

    if (fingerprints && fingerprints.length) {
      this.fingerprints = fingerprints.map((print) =>
        FingerprintAggregate.create({ ...print, group_key: this.key }),
      );
    }

    const errors = validateSync(this, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
  }

  get instance(): IFingerprintGroup {
    return {
      key: this.key,
      fingerprints: this.fingerprints.map((print) => print.instance),
    };
  }
}
