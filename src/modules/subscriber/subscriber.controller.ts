import { Body, Controller, Post, UseGuards, Req, Param } from '@nestjs/common';
import { SubscriberService } from '@/modules/subscriber/subscriber.service';
import { JwtGuard } from '@/providers/jwt';
import { SubscribeDto } from '@/modules/subscriber/dto-controller';
import {
  Permission,
  PermissionGuard,
  SUBSCRIBER_CREATE,
} from '@/providers/permission';
import { CommonError, errors } from '@/common/error';

@Controller('api/v1/projects/:projectId/subscribers')
@UseGuards(JwtGuard)
export class SubscriberController {
  constructor(readonly subscriberService: SubscriberService) {}

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
    return await this.subscriberService.create({
      ...dto,
      projectId: Number(projectId),
    });
  }
}
