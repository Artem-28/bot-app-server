import { ISubscriber, SubscriberAggregate } from '@/models/subscriber';
import {
  BuilderOptionsDto,
  DeleteBuilderOptions,
} from '@/common/utils/builder';

export abstract class SubscriberRepositoryDomain {
  abstract create(subscriber: ISubscriber): Promise<SubscriberAggregate>;
  abstract getOne(
    options?: BuilderOptionsDto<ISubscriber>,
  ): Promise<SubscriberAggregate | null>;
  abstract getMany(
    options?: BuilderOptionsDto<ISubscriber>,
  ): Promise<SubscriberAggregate[]>;
  abstract unsubscribe(
    data: Pick<ISubscriber, 'projectId' | 'userId'>,
  ): Promise<boolean>;
  abstract exist(options?: BuilderOptionsDto<ISubscriber>): Promise<boolean>;

  abstract remove(
    options?: DeleteBuilderOptions<ISubscriber>,
  ): Promise<boolean>;
}
