import { IBaseEntity } from '@/models/base';
import { IRespondent } from '@/models/respondent';
import { IMessage } from '@/models/message';

export interface IMessageSessionInstance extends IBaseEntity {
  /** Индификатор проекта */
  project_id: number;

  /** Индификатор скрипта */
  script_id: number;

  /** Индификатор респондента */
  respondent_id: number;

  /** Название сессии */
  title: string;

  /** Время окончания сессии */
  end_at: Date | null;
}

export interface IMessageSessionRelation {
  respondent: IRespondent | null;
  messages: IMessage[];
}

export type IMessageSession = IMessageSessionInstance & IMessageSessionRelation;
