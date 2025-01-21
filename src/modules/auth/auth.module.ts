import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthDataRepository } from '@/repositories/auth-data';

@Module({
  providers: [AuthService, AuthDataRepository],
  controllers: [AuthController],
})
export class AuthModule {}
