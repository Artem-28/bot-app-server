import { BaseRepository } from '@/repositories/base.repository';
import { ChatSessionRepositoryDomain } from '@/repositories/chat-session/chat-session-repository.domain';
import {
  ChatSessionAggregate,
  ChatSessionEntity,
  IChatSession,
} from '@/models/chat-session';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ChatSessionRepository
  extends BaseRepository
  implements ChatSessionRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
    super(dataSource, request);
  }
  async create(data: IChatSession): Promise<ChatSessionAggregate> {
    const result = await this.getRepository(ChatSessionEntity).save(data);
    return ChatSessionAggregate.create(result);
  }
}
