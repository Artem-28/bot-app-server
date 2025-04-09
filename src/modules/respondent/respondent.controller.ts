import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { RespondentService } from '@/modules/respondent/respondent.service';
import {
  Permission,
  PermissionGuard,
  RESPONDENT_CREATE,
  RESPONDENT_VIEW,
  SCRIPT_UPDATE,
} from '@/providers/permission';
import { UpdateRespondentDto } from '@/modules/respondent/dto';
import { JwtGuard } from '@/providers/jwt';
import {
  ParamProject,
  ParamProjectTransformer,
  ParamRespondent,
  ParamRespondentTransformer,
} from '@/common/param';

@Controller('api/v1/projects/:project_id/respondents')
export class RespondentController {
  constructor(readonly respondentService: RespondentService) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseGuards(PermissionGuard)
  @Permission(RESPONDENT_CREATE)
  public async create(
    @ParamProjectTransformer() param: ParamProject,
    @Body() body: UpdateRespondentDto,
  ) {
    return await this.respondentService.create({
      ...param,
      ...body,
    });
  }

  @Get()
  @UseGuards(JwtGuard)
  @UseGuards(PermissionGuard)
  @Permission(RESPONDENT_VIEW)
  public async projectScripts(@ParamProjectTransformer() param: ParamProject) {
    return await this.respondentService.projectRespondents(param);
  }

  @Patch(':respondent_id')
  @UseGuards(JwtGuard)
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_UPDATE)
  public async update(
    @ParamRespondentTransformer() param: ParamRespondent,
    @Body() body: UpdateRespondentDto,
  ) {
    return await this.respondentService.update(param, body);
  }
}
