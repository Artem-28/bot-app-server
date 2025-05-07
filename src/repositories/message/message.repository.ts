import { BaseRepository } from '@/repositories/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';

import { MessageRepositoryDomain } from '@/repositories/message';
import { IMessage, MessageAggregate, MessageEntity } from '@/models/message';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';
import { ProjectEntity } from '@/models/project';
import { hToArray } from '@/common/utils/formatter';

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

  async lastMessages(
    sessionId: number | number[],
  ): Promise<MessageAggregate[]> {
    const sessionIds = hToArray(sessionId);
    if (!sessionIds.length) return [];
    const repository = this.getRepository(MessageEntity);

    const subQuery = repository
      .createQueryBuilder('m')
      .select('MAX(m.created_at)', 'max_created_at')
      .addSelect('m.session_id', 'session_id')
      .where('m.session_id IN (:sessionIds)')
      .groupBy('m.session_id')
      .getQuery();

    const result = await repository
      .createQueryBuilder('message')
      .innerJoin(
        `(${subQuery})`,
        'latest',
        'message.session_id = latest.session_id AND message.created_at = latest.max_created_at',
      )
      .setParameter('sessionIds', sessionIds)
      .getMany();

    return result.map((item) => MessageAggregate.create(item));
  }
}
