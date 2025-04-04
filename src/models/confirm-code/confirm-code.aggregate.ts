import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { BaseAggregate } from '@/models/base';
import {
  ConfirmCodeTypeEnum,
  IConfirmCode,
} from '@/models/confirm-code/confirm-code.interface';

export class ConfirmCodeAggregate
  extends BaseAggregate<IConfirmCode>
  implements IConfirmCode
{
  /** Значение кода */
  @Exclude()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  value: string;

  /** Тип подтверждения кода */
  @IsDefined()
  @IsEnum(ConfirmCodeTypeEnum)
  type: ConfirmCodeTypeEnum;

  /** Адрес отправления кода */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  destination: string;

  /** Срок действия кода */
  @IsDate()
  live_at = new Date();

  /** Задержка отправки */
  @IsDate()
  delay_at = new Date();

  @IsBoolean()
  matched = false;

  static create(data: Partial<IConfirmCode>) {
    const _entity = new ConfirmCodeAggregate();
    _entity.update(data)
    return _entity;
  }

  get instance(): IConfirmCode {
    return {
      crated_at: this.crated_at,
      updated_at: this.updated_at,
      value: this.value,
      type: this.type,
      destination: this.destination,
      live_at: this.live_at,
      delay_at: this.delay_at,
    };
  }

  @Expose()
  get live(): boolean {
    const timestamp = new Date().getTime();
    const liveTimestamp = new Date(this.live_at).getTime();
    return timestamp < liveTimestamp;
  }

  @Expose()
  get delay(): boolean {
    const timestamp = new Date().getTime();
    const delayTimestamp = new Date(this.delay_at).getTime();
    return timestamp <= delayTimestamp;
  }

  setLiveTime(this, time: number): void {
    const timestamp = new Date().getTime();
    this.live_at = new Date(timestamp + time * 1000);
  }

  setDelayTime(this, time: number): void {
    const timestamp = new Date().getTime();
    this.delay_at = new Date(timestamp + time * 1000);
  }

  match(this, value: string): void {
    this.matched = this.value === value;
  }
}
