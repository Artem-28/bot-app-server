import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProviderModule } from '@/providers/provider.module';
import { CommonModule } from '@/common/common.module';

// Configuration

// Controller

// Service

@Module({
  imports: [CommonModule, ProviderModule, AuthModule],
  providers: [],
})
export class AppModule {}
