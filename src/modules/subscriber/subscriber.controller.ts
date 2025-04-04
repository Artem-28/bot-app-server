import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Param,
  Delete,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { SubscriberService } from '@/modules/subscriber/subscriber.service';
import { JwtGuard } from '@/providers/jwt';
import {
  Permission,
  PermissionGuard,
  SUBSCRIBER_CREATE,
  SUBSCRIBER_REMOVE,
  SUBSCRIBER_VIEW,
} from '@/providers/permission';
import { CommonError, errors } from '@/common/error';
import { SubscribeDto } from '@/modules/subscriber/dto';
import { PermissionService } from '@/modules/permission/permission.service';
import { TransactionInterceptor } from '@/common/interceptors';

@Controller('api/v1/projects/:projectId/subscribers')
@UseGuards(JwtGuard)
export class SubscriberController {
  constructor(
    readonly subscriberService: SubscriberService,
    readonly permissionService: PermissionService,
  ) {}

  @Post()
  @UseGuards(PermissionGuard)
  @Permission(SUBSCRIBER_CREATE)
  async subscribe(
    @Req() req,
    @Param('projectId') projectId,
    @Body() dto: SubscribeDto,
  ) {
    if (req.user.email === dto.email) {
      throw new CommonError({
        messages: errors.subscriber.owner_project,
      });
    }
    projectId = Number(projectId);
    // Добавление подписшика в проект
    return await this.subscriberService.create({
      ...dto,
      project_id: projectId,
    });
  }

  @Get()
  @UseGuards(PermissionGuard)
  @Permission(SUBSCRIBER_VIEW)
  async subscribers(@Param('projectId') projectId) {
    projectId = Number(projectId);
    return await this.subscriberService.projectSubscribers(projectId);
  }

  @Post('unsubscribe')
  @UseInterceptors(TransactionInterceptor)
  async unsubscribe(@Req() req, @Param('projectId') projectId) {
    const project_id = Number(projectId);
    const user_id = req.user.id;
    await this.subscriberService.unsubscribe({ project_id, user_id });

    const result = await this.permissionService.update({
      project_id,
      user_id,
      permissions: [],
    });

    const success = result.permissions.length === 0;
    if (!success) {
      throw new CommonError({ messages: errors.subscriber.unsubscribe });
    }
    return success;
  }

  @Delete(':subscriberId')
  @UseGuards(PermissionGuard)
  @Permission(SUBSCRIBER_REMOVE)
  @UseInterceptors(TransactionInterceptor)
  async removeSubscriber(@Param() params) {
    const project_id = Number(params.projectId);
    const subscriber_id = Number(params.subscriberId);
    const removedSubscriber = await this.subscriberService.remove({
      project_id,
      subscriber_id,
    });
    const result = await this.permissionService.update({
      project_id,
      user_id: removedSubscriber.user_id,
      permissions: [],
    });

    const success = result.permissions.length === 0;
    if (!success) {
      throw new CommonError({ messages: errors.subscriber.remove });
    }
    return success;
  }
}
