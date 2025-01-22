import { Injectable } from '@nestjs/common';
import { jwtConfig } from '@/providers/jwt/jwt.config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { AuthDataEntity } from '@/models/auth-data';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@/models/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly _dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
      passReqToCallback: true,
    });
  }

  async validate(request, payload) {
    if (!payload) return false;

    const authData = await this.getAuthData(payload.authDataId);
    if (!authData || !authData.accessToken) return false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accessToken, password, ...params } = authData;
    request.authData = { ...params };

    const matched = await bcrypt.compare(
      JSON.stringify(payload),
      authData.accessToken,
    );
    if (!matched) return false;

    return this.getAuthUser(authData.login);
  }

  private async getAuthData(id: number) {
    return await this._dataSource.manager
      .getRepository(AuthDataEntity)
      .createQueryBuilder()
      .where({ id })
      .getOne();
  }

  private async getAuthUser(email: string) {
    return await this._dataSource.manager
      .getRepository(UserEntity)
      .createQueryBuilder()
      .where({ email })
      .getOne();
  }

  private getAccessToken(request) {
    let token = null;
    const headers = request.headers;
    const authorizationHeader = headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      token = authorizationHeader.substring(7);
    }
    return token;
  }
}
