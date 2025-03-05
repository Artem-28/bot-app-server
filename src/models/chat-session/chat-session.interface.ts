import { IBase } from '@/models/base';

export interface IChatSession extends IBase {
  /** Индификатор проекта */
  projectId: number;

  /** Индификатор скрипта */
  scriptId: number;

  /** Индификатор респондента */
  respondentId: number;

  /** Ключ сессии */
  key: string;

  /** Название сессии */
  title: string;

  /** Дата последней активности */
  lastActiveAt: Date;

  /** Время окончания сессии */
  overAt: Date | null;
}
