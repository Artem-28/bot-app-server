import { IBaseEntity} from '@/models/base';

export enum ConfirmCodeTypeEnum {
  REGISTRATION = 'registration',
  UPDATE_PASSWORD = 'update_password',
}

export interface IValidateCodeResponse {
  matched: boolean,
  live: boolean;
  delay: boolean;
}

export type TValidateCodeField = keyof IValidateCodeResponse;

export interface IConfirmCode extends IBaseEntity {
  /** Значение кода */
  value: string;

  /** Тип подтверждения кода */
  type: ConfirmCodeTypeEnum;

  /** Адрес отправления кода */
  destination: string;

  /** Срок действия кода */
  live_at: Date;

  /** Задержка для отправки */
  delay_at: Date;
}
