import { Module } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';
import { MessengerService } from '@/modules/messenger';
import { FingerprintService } from '@/modules/fingerprint';
import { RespondentService } from '@/modules/respondent';
import { FingerprintRepository } from '@/repositories/fingerprint';
import { RespondentFingerprintRepository } from '@/repositories/respondent-fingerprint';
import { RespondentRepository } from '@/repositories/respondent';
import { ScriptRepository } from '@/repositories/script';
import { MessageSessionRepository } from '@/repositories/message-session';
import { MessengerConnectionRepository } from '@/repositories/messenger-connection';
import { MessageRepository } from '@/repositories/message';
import { UserRepository } from '@/repositories/user';

@Module({
  providers: [
    WidgetService,
    FingerprintService,
    FingerprintRepository,
    ScriptRepository,
    RespondentService,
    RespondentFingerprintRepository,
    RespondentRepository,
    MessageSessionRepository,
    MessageRepository,
    UserRepository,
  ],
  controllers: [WidgetController],
})
export class WidgetModule {}
