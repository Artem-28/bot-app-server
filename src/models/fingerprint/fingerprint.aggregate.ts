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
  group_key: string;

  @IsDate()
  last_active_at = new Date();

  @IsDate()
  created_at = new Date();

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
      group_key: this.group_key,
      last_active_at: this.last_active_at,
      created_at: this.created_at,
    };
  }

  activity() {
    this.last_active_at = new Date();
  }
}
