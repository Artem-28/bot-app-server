import { IBase } from '@/models/base';
import { RespondentFingerprintAggregate } from '@/models/respondent-fingerprint';

export interface IBaseRespondent extends IBase {
  /** Проект к которому привязан респондента */
  projectId: number;

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

export interface IRespondentRelation {
  fingerprints: RespondentFingerprintAggregate[];
}

export interface IRespondent extends IBaseRespondent {
  fingerprints: Partial<RespondentFingerprintAggregate>[];
}
