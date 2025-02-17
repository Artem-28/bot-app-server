import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from '@/repositories/permission';
import { UserPermissionRepository } from '@/repositories/user-permission';
import { SubscriberService } from '@/modules/subscriber/subscriber.service';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';

@Module({
  providers: [
    PermissionService,
    PermissionRepository,
    UserPermissionRepository,
    SubscriberService,
    SubscriberRepository,
    UserRepository,
  ],
  controllers: [PermissionController],
})
export class PermissionModule {}
