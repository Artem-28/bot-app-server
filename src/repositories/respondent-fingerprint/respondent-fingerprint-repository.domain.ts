import { BuilderOptionsDto } from '@/common/utils/builder';
import {
  IRespondentFingerprint,
  RespondentFingerprintAggregate,
} from '@/models/respondent-fingerprint';

export abstract class RespondentFingerprintRepositoryDomain {
  abstract getOne(
    options?: BuilderOptionsDto<IRespondentFingerprint>,
  ): Promise<RespondentFingerprintAggregate | null>;
}
