import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { SubscriberRepositoryDomain } from '@/repositories/subscriber/subscriber-repository.domain';
import {
  ISubscriber,
  SubscriberAggregate,
  SubscriberEntity,
} from '@/models/subscriber';
import { FilterDto } from '@/common/dto';
import { HQueryBuilder } from '@/common/utils/database';
import {ProjectAggregate, ProjectEntity} from "@/models/project";

@Injectable()
export class SubscriberRepository
  extends BaseRepository
  implements SubscriberRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
    super(dataSource, request);
  }

  async insert(subscribers: ISubscriber | ISubscriber[]) {
    const result =
      await this.getRepository(SubscriberEntity).insert(subscribers);
    console.log('INSERT RESULT', result);
    return Promise.resolve([]);
  }

  async create(subscriber: ISubscriber): Promise<SubscriberAggregate> {
    const result = await this.getRepository(SubscriberEntity).save(subscriber);
    return SubscriberAggregate.create(result);
  }

  async getMany(
    filter: FilterDto<ISubscriber> | FilterDto<ISubscriber>[],
  ): Promise<SubscriberAggregate[]> {
    const repository = this.getRepository(SubscriberEntity);
    const query = new HQueryBuilder(repository, { filter: filter });

    const result = await query.builder.getMany();
    if (!result) return null;
    return result.map((item) => SubscriberAggregate.create(item));
  }

  async getOne(
    filter: FilterDto<ISubscriber> | FilterDto<ISubscriber>[],
  ): Promise<SubscriberAggregate | null> {
    const repository = this.getRepository(SubscriberEntity);
    const query = new HQueryBuilder(repository, { filter: filter });

    const result = await query.builder.getOne();
    if (!result) return null;
    return SubscriberAggregate.create(result);
  }
}
