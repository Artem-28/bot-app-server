import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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

@Controller('api/v1/projects/:projectId/respondents')
@UseGuards(JwtGuard)
export class RespondentController {
  constructor(readonly respondentService: RespondentService) {}

  @Post()
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
  @UseGuards(PermissionGuard)
  @Permission(RESPONDENT_VIEW)
  public async projectScripts(@Param() param: IProjectParam) {
    return await this.respondentService.projectRespondents(param);
  }

  @Patch(':respondentId')
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_UPDATE)
  public async update(
    @Param() param: IRespondentParam,
    @Body() body: UpdateRespondentDto,
  ) {
    return await this.respondentService.update(param, body);
  }
}
