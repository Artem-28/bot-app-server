import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@/providers/jwt';
import { ScriptService } from '@/modules/script/script.service';
import { UpdateScriptDto, CreateScriptDto } from '@/modules/script/dto';
import {
  Permission,
  PermissionGuard,
  SCRIPT_CREATE,
  SCRIPT_REMOVE,
  SCRIPT_UPDATE,
  SCRIPT_VIEW,
} from '@/providers/permission';
import { IProjectParam, IScriptParam } from '@/common/types';

@Controller('api/v1/projects/:projectId/scripts')
@UseGuards(JwtGuard)
export class ScriptController {
  constructor(readonly scriptService: ScriptService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_CREATE)
  public async create(
    @Param() param: IProjectParam,
    @Body() body: CreateScriptDto,
  ) {
    return await this.scriptService.create(param, body);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_VIEW)
  public async projectScripts(@Param() param: IProjectParam) {
    return await this.scriptService.projectScripts(param);
  }

  @Delete(':scriptId')
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_REMOVE)
  public async remove(@Param() param: IScriptParam) {
    return await this.scriptService.remove(param);
  }

  @Patch(':scriptId')
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_UPDATE)
  public async update(
    @Param() param: IScriptParam,
    @Body() body: UpdateScriptDto,
  ) {
    return await this.scriptService.update(param, body);
  }

  @Get(':scriptId')
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_VIEW)
  public async info(@Param() param: IScriptParam) {
    return await this.scriptService.info(param);
  }
}
