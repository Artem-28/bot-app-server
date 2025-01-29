import { Injectable } from '@nestjs/common';
import { AuthDataRepository } from '@/repositories/auth-data';
import * as bcrypt from 'bcrypt';
import { AuthDataAggregate } from '@/models/auth-data';
import { AuthDataDto, UpdatePasswordDto } from '@/modules/auth-data/dto';
import { SignInDto } from '@/modules/auth/dto';
import { CommonError } from '@/common/error';
import { JwtService } from '@nestjs/jwt';
import { IToken } from '@/common/types';
import { IConfirmCode } from '@/models/confirm-code';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthDataService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
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
      hashToken: null,
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

  public async updatePassword(dto: UpdatePasswordDto, throwException = false) {
    const authData = await this._authDataRepository.getOne(dto.login);
    if (!authData && throwException) {
      throw new CommonError({
        field: null,
        ctx: 'field',
        message: 'errors.email.not_registered',
      });
    }
    if (!authData) return false;

    const password = await bcrypt.hash(dto.password, 10);
    const success = await this._authDataRepository.update(authData.id, {
      password,
      hashToken: null,
    });

    if (!success && throwException) {
      throw new CommonError({
        field: null,
        ctx: 'app',
        message: 'errors.reset_password.base_error',
      });
    }

    return success;
  }

  public async createResetPasswordLink(
    code: IConfirmCode,
    throwException = false,
  ) {
    const exist = await this._authDataRepository.exist(code.destination);
    if (!exist && throwException) {
      throw new CommonError({
        field: null,
        ctx: 'field',
        message: 'errors.email.not_registered',
      });
    }
    if (!exist) return '';
    const expiresIn = this.expiresTokenPassword(code.liveAt);
    const token = this._jwtService.sign(
      {
        login: code.destination,
        code: code.value,
      },
      { expiresIn },
    );
    const baseUrl = this._configService.get('FRONTEND_CONSTRUCTOR_BASE_URL');
    const url = new URL(`${baseUrl}/reset_password/`);
    const params = new URLSearchParams({ token });
    url.search = params.toString();
    return url.toString();
  }

  private expiresTokenPassword(date: Date) {
    const current = new Date().getTime();
    const live = new Date(date).getTime();
    const expires = Math.round((live - current) / 1000);
    return `${expires}s`;
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
      hashToken,
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
