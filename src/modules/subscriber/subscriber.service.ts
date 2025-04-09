import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';
import { CreateSubscriberDto } from '@/modules/subscriber/dto';
import { CommonError, errors } from '@/common/error';
import { SubscriberAggregate, SubscriberUser } from '@/models/subscriber';
import { ParamSubscriber } from '@/common/param';

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
        user_id: user.id,
        project_id: dto.project_id,
      }),
    );

    return SubscriberUser.create(subscriber, user);
  }

  public async checkExist(param: ParamSubscriber, throwException = false) {
    const exist = await this._subscriberRepository.exist({
      filter: [
        { field: 'project_id', value: param.project_id },
        { field: 'user_id', value: param.user_id, operator: 'and' },
      ],
    });

    if (!exist && throwException) {
      throw new CommonError({ messages: errors.subscriber.not_exist });
    }
    return exist;
  }

  // Удаление пользователя из подписчиков
  public async remove(param: ParamSubscriber) {
    const subscriber = await this._subscriberRepository.getOne({
      filter: [
        { field: 'project_id', value: param.project_id },
        { field: 'user_id', value: param.user_id, operator: 'and' },
      ],
    });

    if (!subscriber) {
      throw new CommonError({ messages: errors.subscriber.not_exist });
    }

    const success = await this._subscriberRepository.remove({
      filter: [
        { field: 'project_id', value: param.project_id },
        { field: 'user_id', value: param.user_id, operator: 'and' },
      ],
    });

    if (!success) {
      throw new CommonError({ messages: errors.subscriber.remove });
    }

    return subscriber;
  }

  public async projectSubscribers(projectId: number) {
    const subscribers = await this._subscriberRepository.getMany({
      filter: { field: 'project_id', value: projectId },
    });
    if (!subscribers.length) return [];

    const mapSubscribers = subscribers.reduce((acc, user) => {
      acc[user.user_id] = user;
      return acc;
    }, {});

    const userIds = subscribers.map((subscribe) => subscribe.user_id);
    const users = await this._userRepository.getMany({
      filter: { field: 'id', value: userIds },
    });

    return users.map((user) =>
      SubscriberUser.create(mapSubscribers[user.id], user),
    );
  }
}
