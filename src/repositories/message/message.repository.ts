import { BaseRepository } from '@/repositories/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';

import { MessageRepositoryDomain } from '@/repositories/message';
import { IMessage, MessageAggregate, MessageEntity } from '@/models/message';

@Injectable()
export class MessageRepository
  extends BaseRepository
  implements MessageRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }

  async create(data: IMessage): Promise<MessageAggregate> {
    const result = await this.getRepository(MessageEntity).save(data);
    return MessageAggregate.create(result);
  }
}
