import { BaseRepository } from '@/repositories/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';
import {
  ChatConnectionAggregate,
  ChatConnectionEntity,
  IChatConnection,
} from '@/models/chat-connections';
import { ChatConnectionRepositoryDomain } from '@/repositories/chat-connection/chat-connection-repository.domain';

@Injectable()
export class ChatConnectionRepository
  extends BaseRepository
  implements ChatConnectionRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }
  async create(data: IChatConnection): Promise<ChatConnectionAggregate> {
    const result = await this.getRepository(ChatConnectionEntity).save(data);
    return ChatConnectionAggregate.create(result);
  }

  async getOne(
    options?: BuilderOptionsDto<IChatConnection>,
  ): Promise<ChatConnectionAggregate | null> {
    const repository = this.getRepository(ChatConnectionEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return ChatConnectionAggregate.create(result);
  }

  async update(
    id: number,
    data: Partial<IChatConnection>,
  ): Promise<UpdateResult> {
    return this.getRepository(ChatConnectionEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where({ id })
      .execute();
  }
}
