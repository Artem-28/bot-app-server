import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ConfirmCodeService } from '@/modules/confirm-code/confirm-code.service';
import { TransactionInterceptor } from '@/common/interceptors';
import {
  CheckConfirmCodeDto,
  CreateConfirmCodeDto,
} from '@/modules/confirm-code/dto';

@Controller('api/v1/confirm-code')
export class ConfirmCodeController {
  constructor(readonly confirmCodeService: ConfirmCodeService) {}

  @Post('send')
  @UseInterceptors(TransactionInterceptor)
  public async send(@Body() body: CreateConfirmCodeDto) {
    return await this.confirmCodeService.create(body);
  }

  @Post('check')
  public async check(@Body() body: CheckConfirmCodeDto) {
    return await this.confirmCodeService.check(body);
  }
}
