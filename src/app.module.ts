import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProviderModule } from '@/providers/provider.module';
import { CommonModule } from '@/common/common.module';
import { AuthDataModule } from './modules/auth-data/auth-data.module';
import { UserModule } from './modules/user/user.module';
import { ConfirmCodeModule } from './modules/confirm-code/confirm-code.module';
import { MailModule } from './modules/mail/mail.module';
import { ProjectModule } from './modules/project/project.module';
import { PermissionModule } from './modules/permission/permission.module';
import { SubscriberModule } from './modules/subscriber/subscriber.module';

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
    ConfirmCodeModule,
    MailModule,
    ProjectModule,
    PermissionModule,
    SubscriberModule,
  ],
  providers: [],
})
export class AppModule {}
