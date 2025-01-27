import { Module } from '@nestjs/common';
import { ConfirmCodeService } from './confirm-code.service';
import { ConfirmCodeController } from './confirm-code.controller';
import { ConfirmCodeRepository } from '@/repositories/confirm-code';

@Module({
  providers: [ConfirmCodeService, ConfirmCodeRepository],
  controllers: [ConfirmCodeController],
})
export class ConfirmCodeModule {}
