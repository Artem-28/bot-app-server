import { AuthDataAggregate, IAuthData } from '@/models/auth-data';

export abstract class AuthDataDomain {
  abstract create(authData: IAuthData): Promise<AuthDataAggregate>;
}
