import { Module } from '@nestjs/common';
import { FingerprintService } from './fingerprint.service';
import { FingerprintRepository } from '@/repositories/fingerprint';

@Module({
  providers: [FingerprintService, FingerprintRepository],
  controllers: [],
})
export class FingerprintModule {}
