import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { FingerprintService } from '@/modules/fingerprint';
import { FingerprintRepository } from '@/repositories/fingerprint';
import { RespondentRepository } from '@/repositories/respondent';
import { RespondentService } from '@/modules/respondent';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';
import { ScriptRepository } from '@/repositories/script';
import { MessageSessionRepository } from '@/repositories/message-session';
import { MessengerConnectionRepository } from '@/repositories/messenger-connection';
import { UserRepository } from '@/repositories/user';

@Module({
  providers: [
    MessengerService,
    FingerprintService,
    RespondentService,
    FingerprintRepository,
    RespondentFingerprintRepository,
    RespondentRepository,
    ScriptRepository,
    MessageSessionRepository,
    MessengerConnectionRepository,
    UserRepository,
  ],
  controllers: [MessengerController],
})
export class MessengerModule {}
