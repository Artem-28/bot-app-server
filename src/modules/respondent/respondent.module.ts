import { Module } from '@nestjs/common';
import { RespondentService } from './respondent.service';
import { RespondentController } from './respondent.controller';
import { RespondentRepository } from '@/repositories/respondent';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';

@Module({
  providers: [
    RespondentService,
    RespondentRepository,
    RespondentFingerprintRepository,
  ],
  controllers: [RespondentController],
})
export class RespondentModule {}
