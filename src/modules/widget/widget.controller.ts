import { Controller, Get, Param, Req, UseInterceptors } from '@nestjs/common';
import { FingerprintService } from '@/modules/fingerprint';
import {
  FingerprintInterceptor,
  TransactionInterceptor,
} from '@/common/interceptors';
import { WidgetService } from '@/modules/widget/widget.service';

@Controller('widget-api/v1/widgets/:script_id')
export class WidgetController {
  constructor(
    readonly widgetService: WidgetService,
    readonly fingerprintService: FingerprintService,
  ) {}

  @Get('start')
  public async start(@Param() param) {
    const script_id = Number(param.script_id);
    return this.widgetService.startData(script_id);
  }

  @Get('connected')
  @UseInterceptors(FingerprintInterceptor)
  @UseInterceptors(TransactionInterceptor)
  public async connected(@Req() req, @Param() param) {
    const script_id = Number(param.script_id);

    console.log('SCRIPT_ID', script_id);

    const data = await this.fingerprintService.getFingerprint(
      req.fingerprint,
      true,
    );

    const fingerprint = data.map((item) => item.fingerprint);
    return this.widgetService.connection({ script_id, fingerprint });
  }

  @Get('history')
  @UseInterceptors(FingerprintInterceptor)
  @UseInterceptors(TransactionInterceptor)
  public async history(@Req() req, @Param() param) {
    const script_id = Number(param.script_id);
    const data = await this.fingerprintService.getFingerprint(
      req.fingerprint,
      true,
    );

    const fingerprint = data.map((item) => item.fingerprint);
    return this.widgetService.getHistory({ script_id, fingerprint });
  }
}
