import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  validateSync,
} from 'class-validator';
import { IFingerprint } from '@/models/fingerprint/fingerprint.interface';
import { DomainError } from '@/common/error';

export class FingerprintAggregate implements IFingerprint {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  fingerprint: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  groupKey: string;

  @IsDate()
  lastActiveAt = new Date();

  @IsDate()
  createdAt = new Date();

  static create(data: Partial<IFingerprint>) {
    const _entity = new FingerprintAggregate();
    _entity.update(data);
    return _entity;
  }

  public update(data: Partial<IFingerprint>) {
    const entries = Object.entries(data);
    if (entries.length === 0) return;

    entries.forEach(([key, value]) => {
      this[key] = value;
    });

    const errors = validateSync(this, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
  }

  get instance(): IFingerprint {
    return {
      fingerprint: this.fingerprint,
      groupKey: this.groupKey,
      lastActiveAt: this.lastActiveAt,
      createdAt: this.createdAt,
    };
  }
}
