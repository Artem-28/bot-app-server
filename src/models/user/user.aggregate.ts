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

export class UserAggregate extends BaseAggregate<IUser> implements IUser {
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
    _user.createdAt = data?.id ? _user.createdAt : new Date();
    const errors = validateSync(_user, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
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
