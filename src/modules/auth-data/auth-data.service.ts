import { Injectable } from '@nestjs/common';
import { AuthDataRepository } from '@/repositories/auth-data';
import * as bcrypt from 'bcrypt';
import { AuthDataAggregate } from '@/models/auth-data';
import { AuthDataDto } from '@/modules/auth-data/dto';
import { SignInDto } from '@/modules/auth/dto';
import { CommonError } from '@/common/error';
import { JwtService } from '@nestjs/jwt';
import { IToken } from '@/common/types';
import {log} from "util";

@Injectable()
export class AuthDataService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _authDataRepository: AuthDataRepository,
  ) {}

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

    return await this.issueToken(authData, throwException);
  }

  public async removeToken(authDataId: number, throwException = false) {
    const success = await this._authDataRepository.update(authDataId, {
      accessToken: null,
    });
    if (!success && throwException) {
      throw new CommonError({
        field: null,
        ctx: 'app',
        message: 'errors.logout.error',
      });
    }

    return success;
  }

  private async issueToken(
    authData: AuthDataAggregate,
    throwException = false,
  ) {
    const token: IToken = { accessToken: null, tokenType: null };
    const payload = { authDataId: authData.id };
    const accessToken = this._jwtService.sign(payload);
    const decodeToken = this._jwtService.decode(accessToken);
    const hashToken = await bcrypt.hash(JSON.stringify(decodeToken), 10);
    const success = await this._authDataRepository.update(authData.id, {
      accessToken: hashToken,
    });
    if (!success && throwException) {
      throw new CommonError({
        field: null,
        ctx: 'app',
        message: 'errors.issue_token.error',
      });
    }
    if (!success) return token;
    token.accessToken = accessToken;
    token.tokenType = 'Bearer';
    return token;
  }
}
