import {
  IsDate,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { BaseAggregate } from '@/models/base';
import {
  ISubscriber,
  ISubscriberUser,
} from '@/models/subscriber/subscriber.interface';
import { IUser } from '@/models/user';

export class SubscriberAggregate extends BaseAggregate implements ISubscriber {
  @IsDefined()
  @IsNumber()
  userId: number;

  @IsDefined()
  @IsNumber()
  projectId: number;

  static create(data: Partial<ISubscriber>) {
    const _subscriber = new SubscriberAggregate();
    Object.assign(_subscriber, data);
    _subscriber.updatedAt = data?.id ? new Date() : _subscriber.updatedAt;
    const errors = validateSync(_subscriber, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return _subscriber;
  }

  get instance(): ISubscriber {
    return {
      id: this.id,
      userId: this.userId,
      projectId: this.projectId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export class SubscriberUser extends BaseAggregate implements ISubscriberUser {
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsDefined()
  @IsNumber()
  userId: number;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsDate()
  lastActiveAt: Date | null = null;

  @IsString()
  @IsDefined()
  name: string;

  static create(subscriber: ISubscriber, user: IUser) {
    const _subscriberUser = new SubscriberUser();
    const { name, email, lastActiveAt } = user;
    Object.assign(_subscriberUser, subscriber, { name, email, lastActiveAt });

    const errors = validateSync(_subscriberUser, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return _subscriberUser;
  }
}
