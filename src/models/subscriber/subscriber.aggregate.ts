import {
  IsDate,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseAggregate } from '@/models/base';
import {
  ISubscriber,
  ISubscriberUser,
} from '@/models/subscriber/subscriber.interface';
import { IUser } from '@/models/user';

export class SubscriberAggregate
  extends BaseAggregate<ISubscriber>
  implements ISubscriber
{
  @IsDefined()
  @IsNumber()
  user_id: number;

  @IsDefined()
  @IsNumber()
  project_id: number;

  static create(data: Partial<ISubscriber>) {
    const _entity = new SubscriberAggregate();
    _entity.update(data);
    return _entity;
  }

  get instance(): ISubscriber {
    return {
      id: this.id,
      user_id: this.user_id,
      project_id: this.project_id,
      crated_at: this.crated_at,
      updated_at: this.updated_at,
    };
  }
}

export class SubscriberUser
  extends BaseAggregate<ISubscriberUser>
  implements ISubscriberUser
{
  @IsDefined()
  @IsNumber()
  project_id: number;

  @IsDefined()
  @IsNumber()
  user_id: number;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsDate()
  last_active_at: Date | null = null;

  @IsString()
  @IsDefined()
  name: string;

  static create(subscriber: ISubscriber, user: IUser) {
    const _entity = new SubscriberUser();
    const { name, email, last_active_at } = user;
    _entity.update({ ...subscriber, name, email, last_active_at });

    return _entity;
  }
}
