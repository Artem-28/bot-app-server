import { Controller, Param, Req, Body, Put, Get, UseGuards } from '@nestjs/common';
import { PermissionService } from '@/modules/permission/permission.service';
import { updatePermissionBodyDto } from '@/modules/permission/dto';
import { SubscriberService } from '@/modules/subscriber/subscriber.service';
import { JwtGuard } from '@/providers/jwt';
import {
  Permission, PERMISSION_LIST,
  PERMISSION_UPDATE,
  PermissionGuard,
} from '@/providers/permission';

@Controller('api/v1/projects/:projectId')
@UseGuards(JwtGuard)
export class PermissionController {
  constructor(
    readonly permissionService: PermissionService,
    readonly subscriberService: SubscriberService,
  ) {}

  @Put('users/:userId/permissions')
  @UseGuards(PermissionGuard)
  @Permission(PERMISSION_UPDATE)
  async update(@Param() params, @Body() body: updatePermissionBodyDto) {
    const checkDto = {
      projectId: Number(params.projectId),
      userId: Number(params.userId),
    };
    await this.subscriberService.checkExist(checkDto, true);

    return await this.permissionService.update({
      ...checkDto,
      permissions: body.permissions,
    });
  }

  @Get('users/:userId/permissions')
  @UseGuards(PermissionGuard)
  @Permission(PERMISSION_LIST)
  async list(@Param() params) {
    const dto = {
      projectId: Number(params.projectId),
      userId: Number(params.userId),
    };
    await this.subscriberService.checkExist(dto, true);
    return await this.permissionService.list(dto);
  }

  @Get('permissions')
  async authPermissions(@Req() req, @Param() params) {
    const dto = {
      userId: req.user.id,
      projectId: Number(params.projectId),
    };
    return await this.permissionService.list(dto);
  }
}
