import { Injectable } from '@nestjs/common';
import { jwtConfig } from '@/providers/jwt/jwt.config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { ConfirmCodeEntity, ConfirmCodeTypeEnum } from '@/models/confirm-code';

@Injectable()
export class PasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt_password',
) {
  constructor(private readonly _dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload) {
    if (!payload) return false;
    const code = await this.getCode(payload.login);
    if (!code || code.value !== payload.code) return false;
    return payload;
  }

  private async getCode(destination) {
    const type = ConfirmCodeTypeEnum.UPDATE_PASSWORD;
    return await this._dataSource.manager
      .getRepository(ConfirmCodeEntity)
      .createQueryBuilder()
      .where({ destination })
      .andWhere({ type })
      .getOne();
  }
}
