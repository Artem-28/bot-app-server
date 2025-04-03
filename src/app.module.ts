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
import { ResourceModule } from './modules/resource/resource.module';
import { ScriptModule } from './modules/script/script.module';
import { RespondentModule } from './modules/respondent';
import { FingerprintModule } from '@/modules/fingerprint';
import { MessengerModule } from '@/modules/messenger';
import { WebsocketModule } from './modules/websocket';

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
    ResourceModule,
    ScriptModule,
    RespondentModule,
    FingerprintModule,
    MessengerModule,
    WebsocketModule,
  ],
  providers: [],
})

export class AppModule {}
