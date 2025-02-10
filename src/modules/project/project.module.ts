import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from '@/repositories/project';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';
import { UserService } from '@/modules/user/user.service';

@Module({
  providers: [
    ProjectService,
    UserService,
    UserRepository,
    ProjectRepository,
    SubscriberRepository,
  ],
  controllers: [ProjectController],
})
export class ProjectModule {}
