import { IUser } from '@/models/user';
import { IBaseEntity } from '@/models/base';

export interface ISubscriber {
  /** Идентификатор пользователя */
  user_id: number;

  /** Идентификатор проекта */
  project_id: number;

  created_at: Date;
}

export interface ISubscriberUser
  extends IBaseEntity,
    Pick<IUser, 'name' | 'last_active_at' | 'email' | 'created_at'> {
  /** Идентификатор проекта */
  project_id: number;

  subscribe_at: Date;
}
