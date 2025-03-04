import { Module } from '@nestjs/common';
import { RespondentService } from './respondent.service';
import { RespondentController } from './respondent.controller';
import { RespondentRepository } from '@/repositories/respondent';

@Module({
  providers: [RespondentService, RespondentRepository],
  controllers: [RespondentController],
})
export class RespondentModule {}
