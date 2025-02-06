import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from '@/repositories/project';
import { SubscriberRepository } from '@/repositories/subscriber';

@Module({
  providers: [ProjectService, ProjectRepository, SubscriberRepository],
  controllers: [ProjectController],
})
export class ProjectModule {}
