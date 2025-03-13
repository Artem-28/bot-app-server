import { IBase } from '@/models/base';

export interface IRespondent extends IBase {
  /** Проект к которому привязан респондента */
  projectId: number;

  fingerprintKey: string | null;

  /** Имя респондента */
  name: string | null;

  /** Фамилия респондента */
  surname: string | null;

  /** Отчество респондента */
  patronymic: string | null;

  /** Email респондента */
  email: string | null;

  /** Телефон респондента */
  phone: string | null;
}
