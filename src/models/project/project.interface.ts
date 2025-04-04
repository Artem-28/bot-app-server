import { IBaseEntity } from '@/models/base';

export interface IProject extends IBaseEntity {
  /** Идентификатор пользователя (владельца проекта) */
  owner_id: number;
  /** Название проекта */
  title: string;
}
