import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@/providers/jwt';
import { ProjectService } from '@/modules/project/project.service';
import { CreateProjectDto } from '@/modules/project/dto-controller';
import {
  Permission,
  PermissionGuard,
  PROJECT_VIEW,
} from '@/providers/permission';

@Controller('api/v1/projects')
@UseGuards(JwtGuard)
export class ProjectController {
  constructor(readonly projectService: ProjectService) {}

  @Post()
  public async create(@Req() req, @Body() dto: CreateProjectDto) {
    return await this.projectService.create({ ownerId: req.user.id, ...dto });
  }

  @Get()
  public async list(@Req() req) {
    return await this.projectService.viewProjects(Number(req.user.id));
  }

  @Get(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_VIEW)
  public async info(@Param('projectId') projectId) {
    return await this.projectService.info(projectId, true);
  }
}
