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
import { MessengerWebsocket } from '@/modules/messenger/messenger.websocket';

@Module({
  providers: [
    MessengerWebsocket,
    MessengerService,
    FingerprintService,
    RespondentService,
    FingerprintRepository,
    RespondentFingerprintRepository,
    RespondentRepository,
    ScriptRepository,
    MessageSessionRepository,
  ],
  controllers: [MessengerController],
})
export class MessengerModule {}
