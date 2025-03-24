import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';
import {
  CreateSubscriberDto,
  ExistSubscriberDto,
  RemoveSubscriberDto,
  UnsubscribeDto,
} from '@/modules/subscriber/dto';
import { CommonError, errors } from '@/common/error';
import { SubscriberAggregate, SubscriberUser } from '@/models/subscriber';

@Injectable()
export class SubscriberService {
  constructor(
    private readonly _subscriberRepository: SubscriberRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async create(dto: CreateSubscriberDto, throwException = false) {
    const user = await this._userRepository.getOne({
      filter: { field: 'email', value: dto.email },
    });

    if (!user && throwException) {
      throw new CommonError({ messages: errors.user.not_exist });
    }

    if (!user) return null;

    const subscriber = await this._subscriberRepository.create(
      SubscriberAggregate.create({
        userId: user.id,
        projectId: dto.projectId,
      }),
    );

    return SubscriberUser.create(subscriber, user);
  }

  public async checkExist(dto: ExistSubscriberDto, throwException = false) {
    const exist = await this._subscriberRepository.exist({
      filter: [
        { field: 'projectId', value: dto.projectId },
        { field: 'userId', value: dto.userId, operator: 'and' },
      ],
    });

    if (!exist && throwException) {
      throw new CommonError({ messages: errors.subscriber.not_exist });
    }
    return exist;
  }

  // Удаление пользователя из подписчиков
  public async remove(dto: RemoveSubscriberDto) {
    const subscriber = await this._subscriberRepository.getOne({
      filter: [
        { field: 'projectId', value: dto.projectId },
        { field: 'id', value: dto.subscriberId, operator: 'and' },
      ],
    });

    if (!subscriber) {
      throw new CommonError({ messages: errors.subscriber.not_exist });
    }

    const success = await this._subscriberRepository.remove({
      filter: { field: 'id', value: dto.subscriberId },
    });

    if (!success) {
      throw new CommonError({ messages: errors.subscriber.remove });
    }

    return subscriber;
  }

  // Подписчик сам отписывается от проекта
  public async unsubscribe(dto: UnsubscribeDto) {
    const subscriber = await this._subscriberRepository.getOne({
      filter: [
        { field: 'projectId', value: dto.projectId },
        { field: 'userId', value: dto.userId, operator: 'and' },
      ],
    });

    if (!subscriber) {
      throw new CommonError({ messages: errors.subscriber.not_exist });
    }

    const success = await this._subscriberRepository.remove({
      filter: { field: 'id', value: subscriber.id },
    });

    if (!success) {
      throw new CommonError({ messages: errors.subscriber.remove });
    }

    return success;
  }

  public async projectSubscribers(projectId: number) {
    const subscribers = await this._subscriberRepository.getMany({
      filter: { field: 'projectId', value: projectId },
    });
    if (!subscribers.length) return [];

    const mapSubscribers = subscribers.reduce((acc, user) => {
      acc[user.userId] = user;
      return acc;
    }, {});

    const userIds = subscribers.map((subscribe) => subscribe.userId);
    const users = await this._userRepository.getMany({
      filter: { field: 'id', value: userIds },
    });

    return users.map((user) =>
      SubscriberUser.create(mapSubscribers[user.id], user),
    );
  }
}
