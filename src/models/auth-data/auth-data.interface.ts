import { IBase } from '@/models/base';

export interface IAuthData extends IBase {
  /** Логин пользователя */
  login: string;

  /** Пароль пользователя */
  password: string;

  /** Токен авторизации пользователя */
  accessToken: string | null;
}
