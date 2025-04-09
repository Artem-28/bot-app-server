import { Controller, Req, Body, Put, Get, UseGuards } from '@nestjs/common';
import { PermissionService } from '@/modules/permission/permission.service';
import { UpdatePermissionDto } from '@/modules/permission/dto';
import { SubscriberService } from '@/modules/subscriber/subscriber.service';
import { JwtGuard } from '@/providers/jwt';
import {
  Permission,
  PERMISSION_LIST,
  PERMISSION_UPDATE,
  PermissionGuard,
} from '@/providers/permission';
import {
  ParamProject,
  ParamSubscriber,
  ParamProjectTransformer,
  ParamSubscriberTransformer,
} from '@/common/param';

@Controller('api/v1/projects/:project_id')
@UseGuards(JwtGuard)
export class PermissionController {
  constructor(
    readonly permissionService: PermissionService,
    readonly subscriberService: SubscriberService,
  ) {}

  @Put('users/:user_id/permissions')
  @UseGuards(PermissionGuard)
  @Permission(PERMISSION_UPDATE)
  async update(
    @ParamSubscriberTransformer() param: ParamSubscriber,
    @Body() body: UpdatePermissionDto,
  ) {
    await this.subscriberService.checkExist(param, true);
    return await this.permissionService.update(param, body);
  }

  @Get('users/:user_id/permissions')
  @UseGuards(PermissionGuard)
  @Permission(PERMISSION_LIST)
  async list(@ParamSubscriberTransformer() param: ParamSubscriber) {
    await this.subscriberService.checkExist(param, true);
    return await this.permissionService.list(param);
  }

  @Get('permissions')
  async authPermissions(
    @Req() req,
    @ParamProjectTransformer() param: ParamProject,
  ) {
    return await this.permissionService.list({
      ...param,
      user_id: req.user.id,
    });
  }
}
