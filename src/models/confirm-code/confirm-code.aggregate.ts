import {
  ConfirmCodeTypeEnum,
  IConfirmCode,
  TValidateCodeField,
} from '@/models/confirm-code/confirm-code.interface';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { CommonError, DomainError } from '@/common/error';
import { Exclude, Expose } from 'class-transformer';
import { hToArray } from '@/common/utils/formatter';

export class ConfirmCodeAggregate implements IConfirmCode {
  /** Идентификатор кода */
  @Exclude()
  @IsOptional()
  @IsNumber()
  id?: number;

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
  liveAt = new Date();

  /** Задержка отправки */
  @IsDate()
  delayAt = new Date();

  /** Дата создания кода */
  @IsDate()
  createdAt = new Date();

  /** Дата обновления кода */
  @IsDate()
  updatedAt = new Date();

  @IsBoolean()
  matched = false;

  static create(data: Partial<IConfirmCode>) {
    const _confirmCode = new ConfirmCodeAggregate();
    Object.assign(_confirmCode, data);
    _confirmCode.updatedAt = data?.id ? new Date() : _confirmCode.updatedAt;
    const errors = validateSync(_confirmCode, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors, { message: 'ConfirmCode not valid ' });
    }
    return _confirmCode;
  }

  get instance(): IConfirmCode {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      value: this.value,
      type: this.type,
      destination: this.destination,
      liveAt: this.liveAt,
      delayAt: this.delayAt,
    };
  }

  @Expose()
  get live(): boolean {
    const timestamp = new Date().getTime();
    const liveTimestamp = new Date(this.liveAt).getTime();
    return timestamp < liveTimestamp;
  }

  @Expose()
  get delay(): boolean {
    const timestamp = new Date().getTime();
    const delayTimestamp = new Date(this.delayAt).getTime();
    return timestamp <= delayTimestamp;
  }

  update(this, data: Partial<IConfirmCode>): void {
    Object.assign(this, data);
  }

  setLiveTime(this, time: number): void {
    const timestamp = new Date().getTime();
    this.liveAt = new Date(timestamp + time * 1000);
  }

  setDelayTime(this, time: number): void {
    const timestamp = new Date().getTime();
    this.delayAt = new Date(timestamp + time * 1000);
  }

  match(this, value: string): void {
    this.matched = this.value === value;
  }
}
