import { Controller, Get } from '@nestjs/common';
import { MessengerService } from '@/modules/messenger/messenger.service';
import {
  ParamProject,
  ParamScript,
  ParamSession,
  ParamProjectTransformer,
  ParamScriptTransformer,
  ParamSessionTransformer,
} from '@/common/param';

@Controller('api/v1/projects/:project_id')
export class MessengerController {
  constructor(readonly messengerService: MessengerService) {}

  @Get('messengers')
  public async getMessengers(@ParamProjectTransformer() param: ParamProject) {
    return await this.messengerService.getMessengers(param.project_id);
  }

  @Get('messengers/:script_id/sessions')
  public async getSessions(@ParamScriptTransformer() param: ParamScript) {
    return this.messengerService.activeSessions(param.script_id);
  }

  @Get('messengers/:script_id/sessions/:session_id/history')
  public async getHistory(@ParamSessionTransformer() param: ParamSession) {
    return this.messengerService.sessionHistory(param.session_id);
  }
}
