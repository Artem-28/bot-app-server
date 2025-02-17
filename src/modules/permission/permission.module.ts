import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from '@/repositories/permission';
import { UserPermissionRepository } from '@/repositories/user-permission';

@Module({
  providers: [
    PermissionService,
    PermissionRepository,
    UserPermissionRepository,
  ],
  controllers: [PermissionController],
})
export class PermissionModule {}
