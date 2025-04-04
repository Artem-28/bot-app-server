import { IBaseEntity} from '@/models/base';

export interface IUser extends IBaseEntity {
  /** Имя пользователя */
  name: string;
  /** Email пользователя */
  email: string;

  /** Телефон пользователя */
  phone: string | null;

  /** Согласие на персональне данные */
  license_agreement: boolean;

  /** Дата подтверждение email */
  email_verified_at: Date | null;

  /** Дата подтверждения телефона */
  phone_verified_at: Date | null;

  /** Дата последней активности пользователя */
  last_active_at: Date | null;
}
