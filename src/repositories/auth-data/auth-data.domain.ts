import { AuthDataAggregate, IAuthData } from '@/models/auth-data';

export abstract class AuthDataDomain {
  abstract create(authData: IAuthData): Promise<AuthDataAggregate>;
  abstract getOne(login: string): Promise<AuthDataAggregate | null>;
}
