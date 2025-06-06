import { IRespondent } from '@/models/respondent';
import { IMessage } from '@/models/message';

export enum SessionMode {
  OPERATOR = 'operator',
  SYSTEM = 'system',
}

export interface IMessageSessionInstance {
  id?: number;
  /** Индификатор проекта */
  project_id: number;

  /** Индификатор скрипта */
  script_id: number;

  /** Индификатор респондента */
  respondent_id: number;

  /** Режим работы сессии */
  mode: SessionMode;

  /** Время закрытия сессии сессии */
  close_at: Date | null;

  /** Время последней активности */
  last_active_at: Date | null;

  /** Время создания сессии */
  created_at: Date;
}

export interface IMessageSessionRelation {
  respondent: IRespondent | null;
  messages: IMessage[];
}

export type IMessageSession = IMessageSessionInstance & IMessageSessionRelation;
