import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';
import { PermissionService } from '@/modules/permission/permission.service';
import { UserPermissionRepository } from '@/repositories/user-permission';

@Module({
  providers: [
    SubscriberService,
    SubscriberRepository,
    UserRepository,
    PermissionService,
    UserPermissionRepository,
  ],
  controllers: [SubscriberController],
})
export class SubscriberModule {}
