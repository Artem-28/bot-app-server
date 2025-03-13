import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatConnectionRepository } from '@/repositories/chat-connection';
import { ScriptRepository } from '@/repositories/script';
import { RespondentRepository } from '@/repositories/respondent';
import { FingerprintService } from '@/modules/fingerprint/fingerprint.service';
import { FingerprintRepository } from '@/repositories/fingerprint';

@Module({
  providers: [
    ChatService,
    FingerprintService,
    ChatGateway,
    ChatConnectionRepository,
    ScriptRepository,
    RespondentRepository,
    FingerprintRepository,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
