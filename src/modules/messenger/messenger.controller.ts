import { Controller, Get, Param, Req, UseInterceptors } from '@nestjs/common';
import { IScriptParam } from '@/common/types';
import {
  FingerprintInterceptor,
  TransactionInterceptor,
} from '@/common/interceptors';
import { MessengerService } from '@/modules/messenger/messenger.service';

@Controller('api/v1/projects/:projectId')
export class MessengerController {
  constructor(
    readonly messengerService: MessengerService,
  ) {}

  @Get('scripts/:scriptId/messengers/connection')
  @UseInterceptors(FingerprintInterceptor)
  @UseInterceptors(TransactionInterceptor)
  public async respondentConnection(@Req() req, @Param() param: IScriptParam) {
    const projectId = Number(param.projectId);
    const scriptId = Number(param.scriptId);

    return await this.messengerService.getConnectionData({
      projectId,
      scriptId,
      fingerprint: req.fingerprint,
    });
  }
}
