import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
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
  license_agreement = false;

  @IsOptional()
  @IsString()
  phone = null;

  @IsOptional()
  @IsDate()
  email_verified_at = null;

  @IsOptional()
  @IsDate()
  last_active_at = null;

  @IsOptional()
  @IsDate()
  phone_verified_at = null;

  static create(data: Partial<IUser>) {
    const _entity = new UserAggregate();
    _entity.update(data)
    return _entity;
  }

  get instance(): IUser {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      email_verified_at: this.email_verified_at,
      phone_verified_at: this.phone_verified_at,
      last_active_at: this.last_active_at,
      license_agreement: this.license_agreement,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  verifyEmail(this: IUser) {
    this.email_verified_at = new Date();
  }
}
