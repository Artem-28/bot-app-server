import { IAuthData } from '@/models/auth-data/auth-data.interface';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { BaseAggregate } from '@/models/base';
import { Exclude } from 'class-transformer';
import { DomainError } from '@/common/error';

export class AuthDataAggregate extends BaseAggregate implements IAuthData {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  login: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Exclude()
  password: string;

  @IsOptional()
  @Exclude()
  accessToken: string | null;

  static create(data: Partial<IAuthData>) {
    const _entity = new AuthDataAggregate();
    Object.assign(_entity, data);
    _entity.updatedAt = data?.id ? new Date() : _entity.updatedAt;
    const errors = validateSync(_entity, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors, { message: 'AuthData not valid ' });
    }
    return _entity;
  }

  get instance(): IAuthData {
    return {
      login: this.login,
      password: this.password,
      accessToken: this.accessToken,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
