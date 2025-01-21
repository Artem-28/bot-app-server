import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProviderModule } from '@/providers/provider.module';
import { CommonModule } from '@/common/common.module';
import { AuthDataModule } from './modules/auth-data/auth-data.module';
import { UserModule } from './modules/user/user.module';

// Configuration

// Controller

// Service

@Module({
  imports: [
    CommonModule,
    ProviderModule,
    AuthModule,
    AuthDataModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
