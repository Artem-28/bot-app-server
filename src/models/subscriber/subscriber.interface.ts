import { IBaseEntity } from '@/models/base';
import { IUser } from '@/models/user';

export interface ISubscriber extends IBaseEntity {
  /** Идентификатор пользователя */
  user_id: number;

  /** Идентификатор проекта */
  project_id: number;
}

export interface ISubscriberUser
  extends ISubscriber,
    Pick<IUser, 'name' | 'last_active_at' | 'email'> {}
