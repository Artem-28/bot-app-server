import { BuilderOptionsDto } from '@/common/utils/builder';
import {
  IMessageSession,
  MessageSessionAggregate,
} from '@/models/message-session';

export abstract class MessageSessionRepositoryDomain {
  abstract create(data: IMessageSession): Promise<MessageSessionAggregate>;
  abstract getOne(
    options?: BuilderOptionsDto<IMessageSession>,
  ): Promise<MessageSessionAggregate | null>;
}
