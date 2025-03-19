import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { FingerprintService } from '@/modules/fingerprint';
import { FingerprintRepository } from '@/repositories/fingerprint';
import { RespondentRepository } from '@/repositories/respondent';
import { RespondentService } from '@/modules/respondent';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';
import { ScriptRepository } from '@/repositories/script';

@Module({
  providers: [
    MessengerService,
    FingerprintService,
    RespondentService,
    FingerprintRepository,
    RespondentFingerprintRepository,
    RespondentRepository,
    ScriptRepository,
  ],
  controllers: [MessengerController],
})
export class MessengerModule {}
