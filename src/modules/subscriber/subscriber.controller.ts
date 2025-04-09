import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
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
import {
  ParamProject,
  ParamSubscriber,
  ParamProjectTransformer,
  ParamSubscriberTransformer,
} from '@/common/param';

@Controller('api/v1/projects/:project_id/subscribers')
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
    @ParamProjectTransformer() param: ParamProject,
    @Body() dto: SubscribeDto,
  ) {
    if (req.user.email === dto.email) {
      throw new CommonError({
        messages: errors.subscriber.owner_project,
      });
    }
    // Добавление подписшика в проект
    return await this.subscriberService.create({
      ...dto,
      ...param,
    });
  }

  @Get()
  @UseGuards(PermissionGuard)
  @Permission(SUBSCRIBER_VIEW)
  async subscribers(@ParamProjectTransformer() param: ParamProject) {
    return await this.subscriberService.projectSubscribers(param.project_id);
  }

  @Post('unsubscribe')
  @UseInterceptors(TransactionInterceptor)
  async unsubscribe(
    @Req() req,
    @ParamProjectTransformer() param: ParamProject,
  ) {
    const user_id = req.user.id;
    await this.subscriberService.remove({ ...param, user_id });

    const result = await this.permissionService.update(
      { ...param, user_id },
      {
        permissions: [],
      },
    );

    const success = result.permissions.length === 0;
    if (!success) {
      throw new CommonError({ messages: errors.subscriber.unsubscribe });
    }
    return success;
  }

  @Delete(':user_id')
  @UseGuards(PermissionGuard)
  @Permission(SUBSCRIBER_REMOVE)
  @UseInterceptors(TransactionInterceptor)
  async removeSubscriber(@ParamSubscriberTransformer() param: ParamSubscriber) {
    await this.subscriberService.remove(param);
    const result = await this.permissionService.update(param, {
      permissions: [],
    });

    const success = result.permissions.length === 0;
    if (!success) {
      throw new CommonError({ messages: errors.subscriber.remove });
    }
    return success;
  }
}
