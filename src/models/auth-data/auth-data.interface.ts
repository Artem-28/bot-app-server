import { IBaseEntity } from '@/models/base';

export interface IAuthData extends IBaseEntity {
  /** Логин пользователя */
  login: string;

  /** Пароль пользователя */
  password: string;

  /** Токен авторизации пользователя */
  hash_token: string | null;
}
