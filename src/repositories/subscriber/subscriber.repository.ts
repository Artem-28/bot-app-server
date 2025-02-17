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
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';

@Injectable()
export class SubscriberRepository
  extends BaseRepository
  implements SubscriberRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
    super(dataSource, request);
  }

  async create(subscriber: ISubscriber): Promise<SubscriberAggregate> {
    const result = await this.getRepository(SubscriberEntity).save(subscriber);
    return SubscriberAggregate.create(result);
  }

  async getMany(
    options?: BuilderOptionsDto<ISubscriber>,
  ): Promise<SubscriberAggregate[]> {
    const repository = this.getRepository(SubscriberEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getMany();
    if (!result) return null;
    return result.map((item) => SubscriberAggregate.create(item));
  }

  async getOne(
    options?: BuilderOptionsDto<ISubscriber>,
  ): Promise<SubscriberAggregate | null> {
    const repository = this.getRepository(SubscriberEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return SubscriberAggregate.create(result);
  }

  async remove(id: number): Promise<boolean> {
    const repository = this.getRepository(SubscriberEntity);
    const query = HQueryBuilder.delete(repository, {
      filter: { field: 'id', value: id },
    });

    const result = await query.builder.execute();
    return !!result.affected;
  }

  async unsubscribe(
    data: Pick<ISubscriber, 'projectId' | 'userId'>,
  ): Promise<boolean> {
    const repository = this.getRepository(SubscriberEntity);
    const query = HQueryBuilder.delete(repository, {
      filter: [
        { field: 'userId', value: data.userId },
        { field: 'projectId', value: data.projectId, operator: 'and' },
      ],
    });
    const result = await query.builder.execute();
    return !!result.affected;
  }

  async exist(options?: BuilderOptionsDto<ISubscriber>): Promise<boolean> {
    const repository = this.getRepository(SubscriberEntity);
    const query = HQueryBuilder.select(repository, options);
    return await query.builder.getExists();
  }
}
