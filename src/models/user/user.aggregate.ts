import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { IUser } from '@/models/user';
import { BaseAggregate } from '@/models/base';

export class UserAggregate extends BaseAggregate implements IUser {
  @IsString()
  @IsDefined()
  name: string;

  @IsEmail()
  @IsDefined()
  email: string;

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
      name: this.name,
      email: this.email,
      phone: this.phone,
      emailVerifiedAt: this.emailVerifiedAt,
      phoneVerifiedAt: this.phoneVerifiedAt,
      lastActiveAt: this.lastActiveAt,
      licenseAgreement: this.licenseAgreement,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  verifyEmail(this: IUser) {
    this.emailVerifiedAt = new Date();
  }
}
