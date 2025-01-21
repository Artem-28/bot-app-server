import { Injectable } from '@nestjs/common';
import { AuthDataRepository } from '@/repositories/auth-data';
import * as bcrypt from 'bcrypt';
import { AuthDataAggregate } from '@/models/auth-data';
import { AuthDataDto } from '@/modules/auth-data/dto';
import { SignInDto } from '@/modules/auth/dto';
import { CommonError } from '@/common/error';

@Injectable()
export class AuthDataService {
  constructor(private readonly _authDataRepository: AuthDataRepository) {}

  public async signUp(dto: AuthDataDto): Promise<AuthDataAggregate> {
    const password = await bcrypt.hash(dto.password, 10);
    const authDataInstance = AuthDataAggregate.create({
      login: dto.email,
      password,
    }).instance;

    return await this._authDataRepository.create(authDataInstance);
  }

  public async signIn(dto: SignInDto, throwException = false) {
    const authData = await this._authDataRepository.getOne(dto.email);
    if (!authData && throwException) {
      throw new CommonError({
        field: 'email',
        ctx: 'field',
        message: 'errors.sing_in.email.invalid',
      });
    }
    if (!authData) return null;

    const passwordMatch = await bcrypt.compare(dto.password, authData.password);

    if (!passwordMatch && throwException) {
      throw new CommonError({
        field: 'email',
        ctx: 'field',
        message: 'errors.sing_in.email.invalid',
      });
    }
    if (!passwordMatch) return null;

    return authData;
  }
}
