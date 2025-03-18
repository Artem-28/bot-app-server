import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { RespondentModule } from './modules/respondent/respondent.module';
import { ChatModule } from './modules/chat/chat.module';
import { FingerprintMiddleware } from '@/common/middleware';
import { FingerprintModule } from './modules/fingerprint/fingerprint.module';

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
    ChatModule,
    FingerprintModule,
    // ChatModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FingerprintMiddleware).forRoutes('api/v1/projects/:projectId/chats/respondent-connection'); // Применяем middleware только к маршруту /protected
  }
}
