import { IBaseEntity } from '@/models/base';

export interface IScript extends IBaseEntity {
  /** Идентификатор проекта к которому привязан скрипт */
  project_id: number;
  /** Название скрипта */
  title: string;
}
