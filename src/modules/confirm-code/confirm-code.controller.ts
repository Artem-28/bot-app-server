import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmCodeService } from '@/modules/confirm-code/confirm-code.service';
import { CheckConfirmCodeDto } from '@/modules/confirm-code/dto';

@Controller('api/v1/confirm-code')
export class ConfirmCodeController {
  constructor(readonly confirmCodeService: ConfirmCodeService) {}

  @Post('check')
  public async check(@Body() body: CheckConfirmCodeDto) {
    return await this.confirmCodeService.check(body);
  }
}
