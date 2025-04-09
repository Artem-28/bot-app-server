import {
  Body,
  Controller,
  Delete,
  Get,
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
import {
  ParamProject,
  ParamScript,
  ParamProjectTransformer,
  ParamScriptTransformer,
} from '@/common/param';

@Controller('api/v1/projects/:project_id/scripts')
@UseGuards(JwtGuard)
export class ScriptController {
  constructor(readonly scriptService: ScriptService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_CREATE)
  public async create(
    @ParamProjectTransformer() param: ParamProject,
    @Body() body: CreateScriptDto,
  ) {
    return await this.scriptService.create(param, body);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_VIEW)
  public async projectScripts(@ParamProjectTransformer() param: ParamProject) {
    return await this.scriptService.projectScripts(param);
  }

  @Delete(':script_id')
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_REMOVE)
  public async remove(@ParamScriptTransformer() param: ParamScript) {
    return await this.scriptService.remove(param);
  }

  @Patch(':script_id')
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_UPDATE)
  public async update(
    @ParamScriptTransformer() param: ParamScript,
    @Body() body: UpdateScriptDto,
  ) {
    return await this.scriptService.update(param, body);
  }

  @Get(':script_id')
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_VIEW)
  public async info(@ParamScriptTransformer() param: ParamScript) {
    return await this.scriptService.info(param);
  }
}
