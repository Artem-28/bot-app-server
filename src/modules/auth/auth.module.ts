import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthDataService } from '@/modules/auth-data/auth-data.service';
import { AuthDataRepository } from '@/repositories/auth-data';
import { UserService } from '@/modules/user/user.service';
import { UserRepository } from '@/repositories/user';

@Module({
  providers: [
    AuthService,
    AuthDataService,
    AuthDataRepository,
    UserService,
    UserRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
