import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSource } from '@/providers/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
  jwtConfig,
  JwtStrategy,
  PasswordStrategy,
} from '@/providers/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailingConfig } from '@/providers/mailing';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(appDataSource.options),
    JwtModule.register(jwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailerModule.forRoot(mailingConfig),
  ],
  providers: [JwtStrategy, PasswordStrategy],
})
export class ProviderModule {}
