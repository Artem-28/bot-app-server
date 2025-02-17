import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from '@/repositories/project';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';
import { UserService } from '@/modules/user/user.service';
import { PermissionService } from '@/modules/permission/permission.service';
import { UserPermissionRepository } from '@/repositories/user-permission';

@Module({
  providers: [
    ProjectService,
    UserService,
    UserRepository,
    ProjectRepository,
    SubscriberRepository,
    PermissionService,
    UserPermissionRepository,
  ],
  controllers: [ProjectController],
})
export class ProjectModule {}
