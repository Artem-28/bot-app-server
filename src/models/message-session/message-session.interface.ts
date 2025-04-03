import { IBase } from '@/models/base';
import {IRespondent, RespondentAggregate} from '@/models/respondent';

export interface IMessageSessionInstance extends IBase {
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
}

export type IMessageSession = IMessageSessionInstance & IMessageSessionRelation;
