import { IBase } from '@/models/base';
import { IUser } from '@/models/user';

export interface ISubscriber extends IBase {
  /** Идентификатор пользователя */
  userId: number;

  /** Идентификатор проекта */
  projectId: number;
}

export interface ISubscriberUser extends ISubscriber, Pick<IUser, 'name' |'lastActiveAt' | 'email'> {}
