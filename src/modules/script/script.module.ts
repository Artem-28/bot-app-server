import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { ScriptController } from './script.controller';
import { ScriptRepository } from '@/repositories/script';

@Module({
  providers: [ScriptService, ScriptRepository],
  controllers: [ScriptController],
})
export class ScriptModule {}
