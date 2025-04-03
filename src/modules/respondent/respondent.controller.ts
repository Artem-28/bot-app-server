import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RespondentService } from '@/modules/respondent/respondent.service';
import {
  Permission,
  PermissionGuard,
  RESPONDENT_CREATE,
  RESPONDENT_VIEW,
  SCRIPT_UPDATE,
} from '@/providers/permission';
import { IProjectParam, IRespondentParam } from '@/common/types';
import { UpdateRespondentDto } from '@/modules/respondent/dto';
import { JwtGuard } from '@/providers/jwt';
import {
  FingerprintInterceptor,
  TransactionInterceptor,
} from '@/common/interceptors';
import { FingerprintService } from '@/modules/fingerprint';

@Controller('api/v1/projects/:projectId/respondents')
export class RespondentController {
  constructor(
    readonly respondentService: RespondentService,
    readonly fingerprintService: FingerprintService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseGuards(PermissionGuard)
  @Permission(RESPONDENT_CREATE)
  public async create(
    @Param() param: IProjectParam,
    @Body() body: UpdateRespondentDto,
  ) {
    const projectId = Number(param.projectId);
    return await this.respondentService.create({
      projectId,
      ...body,
    });
  }

  @Get()
  @UseGuards(JwtGuard)
  @UseGuards(PermissionGuard)
  @Permission(RESPONDENT_VIEW)
  public async projectScripts(@Param() param: IProjectParam) {
    return await this.respondentService.projectRespondents(param);
  }

  @Patch(':respondentId')
  @UseGuards(JwtGuard)
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_UPDATE)
  public async update(
    @Param() param: IRespondentParam,
    @Body() body: UpdateRespondentDto,
  ) {
    return await this.respondentService.update(param, body);
  }

  @Get('identification')
  @UseInterceptors(FingerprintInterceptor)
  @UseInterceptors(TransactionInterceptor)
  public async identification(@Req() req, @Param() param: IProjectParam) {
    const projectId = Number(param.projectId);
    const data = await this.fingerprintService.getFingerprint(
      req.fingerprint,
      true,
    );
    const fingerprint = data.map((item) => item.fingerprint);
    return this.respondentService.respondentIdentity(projectId, fingerprint);
  }
}
