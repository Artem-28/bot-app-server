import { BaseRepository } from '@/repositories/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, DeleteResult } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { MessengerConnectionRepositoryDomain } from '@/repositories/messenger-connection';
import {
  IMessengerConnectionInstance,
  MessengerConnectionAggregate,
  MessengerConnectionEntity,
} from '@/models/messenger-connection';
import { DeleteBuilderOptions, HQueryBuilder } from '@/common/utils/builder';

@Injectable()
export class MessengerConnectionRepository
  extends BaseRepository
  implements MessengerConnectionRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }
  async create(
    data: IMessengerConnectionInstance,
  ): Promise<MessengerConnectionAggregate> {
    const result = await this.getRepository(MessengerConnectionEntity).save(
      data,
    );
    return MessengerConnectionAggregate.create(result);
  }

  remove(
    options: DeleteBuilderOptions<IMessengerConnectionInstance>,
  ): Promise<DeleteResult> {
    const repository = this.getRepository(MessengerConnectionEntity);
    const query = HQueryBuilder.delete(repository, options);
    return query.builder.execute();
  }
}
