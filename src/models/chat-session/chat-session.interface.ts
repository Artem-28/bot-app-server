import { IBase } from '@/models/base';

export interface IChatSession extends IBase {
  /** Индификатор проекта */
  projectId: number;

  /** Индификатор скрипта */
  scriptId: number;

  /** Индификатор респондента */
  respondentId: number;

  /** Название сессии */
  title: string;
}
