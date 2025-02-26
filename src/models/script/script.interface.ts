import { IBase } from '@/models/base';

export interface IScript extends IBase {
  /** Идентификатор проекта к которому привязан скрипт */
  projectId: number;
  /** Название скрипта */
  title: string;
}
