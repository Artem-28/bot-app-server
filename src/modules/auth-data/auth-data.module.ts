import { Module } from '@nestjs/common';
import { AuthDataService } from './auth-data.service';
import { AuthDataRepository } from '@/repositories/auth-data';

@Module({
  providers: [AuthDataService, AuthDataRepository],
})
export class AuthDataModule {}
