import { ChatSessionAggregate, IChatSession } from '@/models/chat-session';
import { BuilderOptionsDto } from '@/common/utils/builder';

export abstract class ChatSessionRepositoryDomain {
  abstract create(data: IChatSession): Promise<ChatSessionAggregate>;
  abstract getOne(
    options?: BuilderOptionsDto<IChatSession>,
  ): Promise<ChatSessionAggregate | null>;
}
