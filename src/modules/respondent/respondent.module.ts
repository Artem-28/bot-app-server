import { Module } from '@nestjs/common';
import { RespondentService } from './respondent.service';
import { RespondentController } from './respondent.controller';
import { RespondentRepository } from '@/repositories/respondent';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';
import { FingerprintService } from '@/modules/fingerprint';
import { FingerprintRepository } from '@/repositories/fingerprint';

@Module({
  providers: [
    RespondentService,
    FingerprintService,
    RespondentRepository,
    RespondentFingerprintRepository,
    FingerprintRepository,
  ],
  controllers: [RespondentController],
})
export class RespondentModule {}
