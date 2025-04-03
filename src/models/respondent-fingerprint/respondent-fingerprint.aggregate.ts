import {
  IsDefined,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { IRespondentFingerprint } from '@/models/respondent-fingerprint/respondent-fingerprint.interface';

export class RespondentFingerprintAggregate implements IRespondentFingerprint {
  @IsNumber()
  @IsOptional()
  respondentId: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  fingerprint: string;

  @IsNumber()
  @IsDefined()
  projectId: number;

  static create(data: IRespondentFingerprint) {
    const _entity = new RespondentFingerprintAggregate();
    _entity.update(data);
    return _entity;
  }

  public update(data: Partial<IRespondentFingerprint>) {
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

  get instance(): IRespondentFingerprint {
    return {
      respondentId: this.respondentId,
      fingerprint: this.fingerprint,
      projectId: this.projectId,
    };
  }
}
