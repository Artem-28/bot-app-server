import { Controller, Get, Param, Req, UseInterceptors } from '@nestjs/common';
import { IScriptParam } from '@/common/types';
import {
  FingerprintInterceptor,
  TransactionInterceptor,
} from '@/common/interceptors';
import { MessengerService } from '@/modules/messenger/messenger.service';
import { FingerprintService } from '@/modules/fingerprint';

@Controller('api/v1/projects/:projectId')
export class MessengerController {
  constructor(
    readonly messengerService: MessengerService,
    readonly fingerprintService: FingerprintService,
  ) {}

  @Get('scripts/:scriptId/messengers/auth')
  @UseInterceptors(FingerprintInterceptor)
  @UseInterceptors(TransactionInterceptor)
  public async getConnectionToken(@Req() req, @Param() param: IScriptParam) {
    const project_id = Number(param.projectId);
    const script_id = Number(param.scriptId);
    const data = await this.fingerprintService.getFingerprint(
      req.fingerprint,
      true,
    );
    const fingerprint = data.map((item) => item.fingerprint);

    return this.messengerService.getConnectionToken({
      project_id,
      script_id,
      fingerprint,
    });
  }
}
