import { Controller, Param, Body, Put } from '@nestjs/common';
import { PermissionService } from '@/modules/permission/permission.service';
import { updatePermissionBodyDto } from '@/modules/permission/dto';

@Controller('api/v1/projects/:projectId/users/:userId/permissions')
export class PermissionController {
  constructor(readonly permissionService: PermissionService) {}

  @Put()
  async update(@Param() params, @Body() body: updatePermissionBodyDto) {
    console.log('update permissions', params, body);
    return await this.permissionService.update({
      projectId: Number(params.projectId),
      userId: Number(params.userId),
      permissions: body.permissions,
    });
  }
}
