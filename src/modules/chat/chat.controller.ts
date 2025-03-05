import { Body, Controller, Param, Post } from '@nestjs/common';
import { ChatService } from '@/modules/chat/chat.service';
import { IProjectParam } from '@/common/types';
import { CreateChatSessionBodyDto } from '@/modules/chat/dto';

@Controller('api/v1/projects/:projectId/chats')
export class ChatController {
  constructor(readonly chatService: ChatService) {}

  @Post()
  public async createSession(
    @Param() param: IProjectParam,
    @Body() body: CreateChatSessionBodyDto,
  ) {
    const projectId = Number(param.projectId);
    return await this.chatService.createSession({
      projectId,
      ...body,
    });
  }
}
