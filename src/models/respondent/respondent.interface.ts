import { IBaseEntity } from '@/models/base';
import { RespondentFingerprintAggregate } from '@/models/respondent-fingerprint';

export interface IBaseRespondent extends IBaseEntity {
  /** Проект к которому привязан респондента */
  project_id: number;

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

export interface IRespondent extends IBaseRespondent {
  fingerprints: Partial<RespondentFingerprintAggregate>[];
}
