import { BuilderOptionsDto } from '@/common/utils/builder';
import {
  ChatConnectionAggregate,
  IChatConnection,
} from '@/models/chat-connections';
import { UpdateResult } from 'typeorm';

export abstract class ChatConnectionRepositoryDomain {
  abstract create(data: IChatConnection): Promise<ChatConnectionAggregate>;
  abstract getOne(
    options?: BuilderOptionsDto<IChatConnection>,
  ): Promise<ChatConnectionAggregate | null>;
  abstract update(
    id: number,
    data: Partial<IChatConnection>,
  ): Promise<UpdateResult>;
}
