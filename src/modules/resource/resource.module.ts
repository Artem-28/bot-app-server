import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { PermissionRepository } from '@/repositories/permission';

@Module({
  providers: [ResourceService, PermissionRepository],
  controllers: [ResourceController],
})
export class ResourceModule {}
