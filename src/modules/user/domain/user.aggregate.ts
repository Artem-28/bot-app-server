import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { DomainError } from '@/common/error';
import { UserCommand } from '@/modules/user/domain/user.command';
import { IUser } from '@/modules/user/domain/user.interface';

export class UserAggregate extends UserCommand implements IUser {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Exclude()
  password: string;

  @IsBoolean()
  @IsDefined()
  licenseAgreement = false;

  @IsOptional()
  @IsString()
  phone = null;

  @IsOptional()
  @IsDate()
  emailVerifiedAt = null;

  @IsOptional()
  @IsDate()
  lastActiveAt = null;

  @IsOptional()
  @IsDate()
  phoneVerifiedAt = null;

  @IsDate()
  createdAt = new Date();

  @IsDate()
  updatedAt = new Date();

  private constructor() {
    super();
  }

  static create(data: Partial<IUser>) {
    const _user = new UserAggregate();
    Object.assign(_user, data);
    _user.updatedAt = data?.id ? new Date() : _user.updatedAt;
    const errors = validateSync(_user, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors, { message: 'User not valid ' });
    }
    return _user;
  }

  get instance(): IUser {
    return {
      email: this.email,
      password: this.password,
      phone: this.phone,
      emailVerifiedAt: this.emailVerifiedAt,
      phoneVerifiedAt: this.phoneVerifiedAt,
      lastActiveAt: this.lastActiveAt,
      licenseAgreement: this.licenseAgreement,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
