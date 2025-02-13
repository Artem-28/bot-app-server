import { Controller, Get } from '@nestjs/common';
import { PermissionService } from '@/modules/permission/permission.service';

@Controller('api/v1/permissions')
export class PermissionController {
  constructor(readonly permissionService: PermissionService) {}
  @Get()
  async list() {
    return await this.permissionService.list();
  }
}
