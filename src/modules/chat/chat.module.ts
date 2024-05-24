import { Module } from '@nestjs/common';
import { ChatRepository } from '@/repositories/chat';
import { RespondentService } from '@/modules/respondent/service/respondent.service';
import { RespondentRepository } from '@/repositories/respondent';
import { ProjectRepository } from '@/repositories/project';
import { ScriptRepository } from '@/repositories/script';
import { ChatService } from '@/modules/chat/service';
import { ChatController } from '@/modules/chat/controller';

@Module({
  providers: [
    ChatService,
    RespondentService,
    ChatRepository,
    RespondentRepository,
    ProjectRepository,
    ScriptRepository,
  ],
  controllers: [ChatController],
})
export class ChatModule {}