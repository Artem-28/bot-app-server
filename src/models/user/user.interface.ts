import { IBase } from '@/models/base';

export interface IUser extends IBase {
  /** Email пользователя */
  email: string;

  /** Телефон пользователя */
  phone: string | null;

  /** Согласие на персональне данные */
  licenseAgreement: boolean;

  /** Дата подтверждение email */
  emailVerifiedAt: Date | null;

  /** Дата подтверждения телефона */
  phoneVerifiedAt: Date | null;

  /** Дата последней активности пользователя */
  lastActiveAt: Date | null;
}
