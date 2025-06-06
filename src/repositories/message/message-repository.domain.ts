import { IMessage, MessageAggregate } from '@/models/message';
import { BuilderOptionsDto } from '@/common/utils/builder';

export abstract class MessageRepositoryDomain {
  abstract create(data: IMessage): Promise<MessageAggregate>;

  abstract getMany(
    options?: BuilderOptionsDto<IMessage>,
  ): Promise<MessageAggregate[]>;

  abstract lastMessages(
    sessionId: number | number[],
  ): Promise<MessageAggregate[]>;
}
