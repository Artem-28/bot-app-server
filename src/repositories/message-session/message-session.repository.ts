import { BaseRepository } from '@/repositories/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';
import { MessageSessionRepositoryDomain } from '@/repositories/message-session';
import {
  IMessageSession,
  IMessageSessionInstance,
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
  async create(
    data: IMessageSessionInstance,
  ): Promise<MessageSessionAggregate> {
    const result = await this.getRepository(MessageSessionEntity).save(data);
    return MessageSessionAggregate.create(result);
  }

  async getOne(
    options?: BuilderOptionsDto<IMessageSessionInstance>,
  ): Promise<MessageSessionAggregate | null> {
    const repository = this.getRepository(MessageSessionEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return MessageSessionAggregate.create(result);
  }

  async lastActiveSessions(project_id: number) {
    const repository = this.getRepository(MessageSessionEntity);
    const result = await repository
      .createQueryBuilder('ms')
      .where('ms.project_id = :project_id', { project_id })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MAX(sub.created_at)')
          .from(MessageSessionEntity, 'sub')
          .where('sub.project_id = ms.project_id')
          .andWhere('sub.script_id = ms.script_id')
          .getQuery();

        return 'ms.updated_at IN (' + subQuery + ')';
      })
      .getMany();

    return result.map((item) => MessageSessionAggregate.create(item));
  }
}
