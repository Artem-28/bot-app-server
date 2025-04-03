import {
  IMessengerConnection,
  IMessengerConnectionInstance,
  MessengerConnectionAggregate,
} from '@/models/messenger-connection';
import { DeleteBuilderOptions } from '@/common/utils/builder';
import { DeleteResult } from 'typeorm';

export abstract class MessengerConnectionRepositoryDomain {
  abstract create(
    data: IMessengerConnection,
  ): Promise<MessengerConnectionAggregate>;

  abstract remove(
    options: DeleteBuilderOptions<IMessengerConnectionInstance>,
  ): Promise<DeleteResult>;
}
