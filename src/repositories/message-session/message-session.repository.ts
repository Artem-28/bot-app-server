import { BaseRepository } from '@/repositories/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';
import { MessageSessionRepositoryDomain } from '@/repositories/message-session';
import {
  IMessageSession,
  MessageSessionAggregate,
  MessageSessionEntity,
} from '@/models/message-session';

@Injectable()
export class MessageSessionRepository
  extends BaseRepository
  implements MessageSessionRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }
  async create(data: IMessageSession): Promise<MessageSessionAggregate> {
    const result = await this.getRepository(MessageSessionEntity).save(data);
    return MessageSessionAggregate.create(result);
  }

  async getOne(
    options?: BuilderOptionsDto<IMessageSession>,
  ): Promise<MessageSessionAggregate | null> {
    const repository = this.getRepository(MessageSessionEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return MessageSessionAggregate.create(result);
  }
}
