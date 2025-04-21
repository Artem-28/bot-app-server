import { IMessage, MessageAggregate } from '@/models/message';

export abstract class MessageRepositoryDomain {
  abstract create(data: IMessage): Promise<MessageAggregate>;
}
