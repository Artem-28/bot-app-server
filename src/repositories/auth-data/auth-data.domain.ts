import { AuthDataAggregate, IAuthData } from '@/models/auth-data';

export abstract class AuthDataDomain {
  abstract create(authData: IAuthData): Promise<AuthDataAggregate>;
  abstract getOne(login: string): Promise<AuthDataAggregate | null>;
  abstract update(id: number, data: Partial<IAuthData>): Promise<boolean>;
  abstract exist(login: string): Promise<boolean>;
}
