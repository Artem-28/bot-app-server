import {
  Controller,
  Post,
  UseGuards,
  Req,
  Param,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from '@/modules/chat/chat.service';
import { JwtGuard } from '@/providers/jwt';
import { IProjectParam } from '@/common/types';
import { RespondentConnectionBodyDto } from '@/modules/chat/dto';
import { TransactionInterceptor } from '@/common/interceptors';
import { FingerprintService } from '@/modules/fingerprint/fingerprint.service';

@Controller('api/v1/projects/:projectId/chats')
export class ChatController {
  constructor(
    readonly chatService: ChatService,
    readonly fingerprintService: FingerprintService,
  ) {}

  @Post('operator-connection')
  @UseGuards(JwtGuard)
  public async operatorConnection(@Req() req, @Param() param: IProjectParam) {
    const projectId = Number(param.projectId);
    return await this.chatService.operatorConnectionData({
      projectId,
      userId: req.user.id,
    });
  }

  @Post('respondent-connection')
  @UseInterceptors(TransactionInterceptor)
  public async respondentConnection(
    @Req() req,
    @Param() param: IProjectParam,
    @Body() body: RespondentConnectionBodyDto,
  ) {
    // return await this.fingerprintService.createOrUpdateFingerprint(
    //   req.fingerprint,
    // );
    // const projectId = Number(param.projectId);
    // return this.chatService.respondentConnectionData({
    //   fingerprint: req.fingerprint,
    //   projectId,
    //   ...body,
    // });
  }
}
