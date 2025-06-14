import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { RespondentRepository } from '@/repositories/respondent';
import { RespondentService } from '@/modules/respondent';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';
import { ScriptRepository } from '@/repositories/script';
import { MessageSessionRepository } from '@/repositories/message-session';
import { MessengerConnectionRepository } from '@/repositories/messenger-connection';
import { UserRepository } from '@/repositories/user';
import { MessageRepository } from '@/repositories/message';

@Module({
  providers: [
    MessengerService,
    RespondentService,
    RespondentFingerprintRepository,
    RespondentRepository,
    ScriptRepository,
    MessageSessionRepository,
    MessengerConnectionRepository,
    MessageRepository,
    UserRepository,
  ],
  controllers: [MessengerController],
})
export class MessengerModule {}
