import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from '@/modules/chat/chat.gateway';
import { ChatSessionRepository } from '@/repositories/chat-session';
import { ScriptRepository } from '@/repositories/script';
import { RespondentRepository } from '@/repositories/respondent';

@Module({
  providers: [
    ChatService,
    ChatGateway,
    ChatSessionRepository,
    ScriptRepository,
    RespondentRepository,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
