import { Global, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { ProjectRepository } from '@/repositories/project';
import { SubscriberRepository } from '@/repositories/subscriber';

@Global()
@Module({
  providers: [PermissionService, ProjectRepository, SubscriberRepository],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
