import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';
import {
  CreateSubscriberDto,
  ExistSubscriberDto,
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
        { field: 'userId', value: dto.userId },
      ],
    });

    if (!exist && throwException) {
      throw new CommonError({ messages: errors.subscriber.not_exist });
    }
    return exist;
  }
}
