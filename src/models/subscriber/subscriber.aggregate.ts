import {
  IsDate,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { BaseAggregate } from '@/models/base';
import {
  ISubscriber,
  ISubscriberUser,
} from '@/models/subscriber/subscriber.interface';
import { IUser } from '@/models/user';
import { DomainError } from '@/common/error';

export class SubscriberAggregate implements ISubscriber {
  @IsDefined()
  @IsNumber()
  user_id: number;

  @IsDefined()
  @IsNumber()
  project_id: number;

  @IsDate()
  created_at = new Date();

  static create(data: Partial<ISubscriber>) {
    const _entity = new SubscriberAggregate();
    _entity.update(data);
    return _entity;
  }

  public update(data: Partial<ISubscriber>) {
    const entries = Object.entries(data);

    entries.forEach(([key, value]) => {
      this[key] = value;
    });
    this.created_at = this.created_at || new Date();

    const errors = validateSync(this, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
  }

  get instance(): ISubscriber {
    return {
      user_id: this.user_id,
      project_id: this.project_id,
      created_at: this.created_at,
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
  @IsEmail()
  email: string;

  @IsOptional()
  @IsDate()
  last_active_at: Date | null = null;

  @IsString()
  @IsDefined()
  name: string;

  @IsDate()
  subscribe_at: Date;

  static create(subscriber: ISubscriber, user: IUser) {
    const _entity = new SubscriberUser();
    const { id, name, email, last_active_at, created_at } = user;
    const { project_id, created_at: subscribe_at } = subscriber;
    _entity.update({
      project_id,
      name,
      email,
      last_active_at,
      id,
      subscribe_at,
      created_at,
    });

    return _entity;
  }
}
