import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import {
  FingerprintInterceptor,
  TransactionInterceptor,
} from '@/common/interceptors';
import { MessengerService } from '@/modules/messenger/messenger.service';
import { FingerprintService } from '@/modules/fingerprint';
import { ParamScript, ParamScriptTransformer } from '@/common/param';

@Controller('api/v1/projects/:project_id')
export class MessengerController {
  constructor(
    readonly messengerService: MessengerService,
    readonly fingerprintService: FingerprintService,
  ) {}

  @Get('scripts/:script_id/messengers/auth')
  @UseInterceptors(FingerprintInterceptor)
  @UseInterceptors(TransactionInterceptor)
  public async getConnectionToken(
    @Req() req,
    @ParamScriptTransformer() param: ParamScript,
  ) {
    const data = await this.fingerprintService.getFingerprint(
      req.fingerprint,
      true,
    );
    const fingerprint = data.map((item) => item.fingerprint);
    return this.messengerService.getConnectionToken({
      ...param,
      fingerprint,
    });
  }
}
