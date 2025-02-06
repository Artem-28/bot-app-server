import { IBase } from '@/models/base';

export interface IProject extends IBase {
  /** Идентификатор пользователя (владельца проекта) */
  ownerId: number;
  /** Название проекта */
  title: string;
}
