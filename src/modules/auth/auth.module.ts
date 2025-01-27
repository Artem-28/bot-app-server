import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthDataService } from '@/modules/auth-data/auth-data.service';
import { AuthDataRepository } from '@/repositories/auth-data';
import { UserService } from '@/modules/user/user.service';
import { UserRepository } from '@/repositories/user';
import { ConfirmCodeService } from '@/modules/confirm-code/confirm-code.service';
import { ConfirmCodeRepository } from '@/repositories/confirm-code';
import { MailService } from '@/modules/mail/mail.service';

@Module({
  providers: [
    AuthService,
    AuthDataService,
    AuthDataRepository,
    UserService,
    UserRepository,
    ConfirmCodeService,
    ConfirmCodeRepository,
    MailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
