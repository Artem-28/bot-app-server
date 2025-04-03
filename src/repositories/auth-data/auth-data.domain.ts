import { AuthDataAggregate, IAuthData } from '@/models/auth-data';
import { BuilderOptionsDto } from '@/common/utils/builder';

export abstract class AuthDataDomain {
  abstract create(authData: IAuthData): Promise<AuthDataAggregate>;
  abstract getOne(
    options?: BuilderOptionsDto<IAuthData>,
  ): Promise<AuthDataAggregate | null>;
  abstract update(id: number, data: Partial<IAuthData>): Promise<boolean>;
  abstract exist(login: string): Promise<boolean>;
}
