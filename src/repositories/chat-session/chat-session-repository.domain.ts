import { ChatSessionAggregate, IChatSession } from '@/models/chat-session';

export abstract class ChatSessionRepositoryDomain {
  abstract create(data: IChatSession): Promise<ChatSessionAggregate>;
}
