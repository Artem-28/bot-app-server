import { BuilderOptionsDto } from '@/common/utils/builder';
import {
  IMessageSession,
  IMessageSessionInstance,
  MessageSessionAggregate,
} from '@/models/message-session';
import { UpdateResult } from 'typeorm';

export abstract class MessageSessionRepositoryDomain {
  abstract create(data: IMessageSession): Promise<MessageSessionAggregate>;

  abstract getOne(
    options?: BuilderOptionsDto<IMessageSessionInstance>,
  ): Promise<MessageSessionAggregate | null>;

  abstract getMany(
    options?: BuilderOptionsDto<IMessageSessionInstance>,
  ): Promise<MessageSessionAggregate[]>;

  abstract lastActiveSessions(
    project_id: number,
  ): Promise<MessageSessionAggregate[]>;

  abstract update(
    id: number,
    data: Partial<IMessageSessionInstance>,
  ): Promise<UpdateResult>;
}
