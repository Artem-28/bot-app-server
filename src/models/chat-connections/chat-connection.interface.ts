import { IBase } from '@/models/base';
import { RespondentAggregate } from '@/models/respondent';
import { UserAggregate } from '@/models/user';
import { ScriptAggregate } from '@/models/script';

export interface IChatConnection extends IBase {
  /** Ключ соединения */
  key: string;

  /** Индификатор проекта */
  projectId: number;

  /** Индификатор скрипта */
  scriptId: number | null;

  /** Индификатор респондента */
  respondentId: number | null;

  /** Индификатор пользователя (оператора) */
  userId: number | null;

  socketId: string | null;

  connected: boolean;
}

export interface IChatConnectionRelation {
  respondent: RespondentAggregate | null;
  operator: UserAggregate | null;
  script: ScriptAggregate | null;
}
