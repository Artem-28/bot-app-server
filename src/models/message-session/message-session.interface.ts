import { IBase } from '@/models/base';

export interface IMessageSession extends IBase {
  /** Индификатор проекта */
  projectId: number;

  /** Индификатор скрипта */
  scriptId: number;

  /** Индификатор респондента */
  respondentId: number;

  /** Название сессии */
  title: string;

  /** Время окончания сессии */
  endAt: Date | null;
}
