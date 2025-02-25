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
import { CreateScriptBodyDto } from '@/modules/script/dto';
import {
  Permission,
  PermissionGuard,
  SCRIPT_CREATE,
} from '@/providers/permission';

@Controller('api/v1/projects/:projectId/scripts')
@UseGuards(JwtGuard)
export class ScriptController {
  constructor(readonly scriptService: ScriptService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @Permission(SCRIPT_CREATE)
  public async create(@Param() param, @Body() body: CreateScriptBodyDto) {
    const projectId = Number(param.projectId);
    return await this.scriptService.create({ projectId, ...body });
  }

  @Patch(':scriptId')
  public async update(@Param() param) {
    const projectId = Number(param.projectId);
    const scriptId = Number(param.scriptId);
  }

  @Get(':scriptId')
  public async info(@Param() param) {
    const projectId = Number(param.projectId);
    const scriptId = Number(param.scriptId);
  }

  @Delete()
  public async remove(@Param() param) {
    const projectId = Number(param.projectId);
    const scriptId = Number(param.scriptId);
  }
}
