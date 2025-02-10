import { ISubscriber, SubscriberAggregate } from '@/models/subscriber';
import { FilterDto } from '@/common/dto';

export abstract class SubscriberRepositoryDomain {
  abstract insert(subscribers: ISubscriber | ISubscriber[]);
  abstract create(subscriber: ISubscriber): Promise<SubscriberAggregate>;
  abstract getOne(
    filter: FilterDto<ISubscriber> | FilterDto<ISubscriber>[],
  ): Promise<SubscriberAggregate | null>;
  abstract getMany(
    filter: FilterDto<ISubscriber> | FilterDto<ISubscriber>[],
  ): Promise<SubscriberAggregate[]>;
  abstract unsubscribe(
    data: Pick<ISubscriber, 'projectId' | 'userId'>,
  ): Promise<boolean>;
}
