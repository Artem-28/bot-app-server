import { IBase } from '@/models/base';
import { IUser } from '@/models/user';
import { IMessageSession } from '@/models/message-session';

export interface IMessengerConnectionInstance extends IBase {
  client_id: string;
  /** Индификатор проекта */
  project_id: number;

  /** Индификатор сессии (используется только для респондента) */
  session_id: number | null;

  /** Индификатор пользователя (оператора) */
  operator_id: number | null;
}

export interface IMessengerConnectionRelation {
  operator: IUser | null;
  session: IMessageSession | null;
}

export type IMessengerConnection = IMessengerConnectionInstance &
  IMessengerConnectionRelation;
