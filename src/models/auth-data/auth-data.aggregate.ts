import { IAuthData } from '@/models/auth-data/auth-data.interface';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { BaseAggregate } from '@/models/base';

export class AuthDataAggregate
  extends BaseAggregate<IAuthData>
  implements IAuthData
{
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
  hash_token: string | null;

  static create(data: Partial<IAuthData>) {
    const _entity = new AuthDataAggregate();
    _entity.update(data);
    return _entity;
  }

  get instance(): IAuthData {
    return {
      login: this.login,
      password: this.password,
      hash_token: this.hash_token,
      crated_at: this.crated_at,
      updated_at: this.updated_at,
    };
  }
}
