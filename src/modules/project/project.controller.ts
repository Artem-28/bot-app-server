import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '@/providers/jwt';
import { ProjectService } from '@/modules/project/project.service';
import {
  Permission,
  PermissionGuard,
  PROJECT_CHANGE_OWNER,
  PROJECT_INFO,
  PROJECT_UPDATE,
} from '@/providers/permission';
import {
  ChangeOwnerBodyDto,
  CreateProjectBodyDto,
  UpdateProjectBodyDto,
} from '@/modules/project/dto';
import { TransactionInterceptor } from '@/common/interceptors';

@Controller('api/v1/projects')
@UseGuards(JwtGuard)
export class ProjectController {
  constructor(readonly projectService: ProjectService) {}

  @Post()
  public async create(@Req() req, @Body() body: CreateProjectBodyDto) {
    return await this.projectService.create({ owner: req.user, ...body });
  }

  @Get()
  public async list(@Req() req) {
    return await this.projectService.viewProjects(Number(req.user.id));
  }

  @Get(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_INFO)
  public async info(@Param('projectId') projectId) {
    return await this.projectService.info(projectId, true);
  }

  @Patch(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_UPDATE)
  public async update(
    @Param('projectId') projectId,
    @Body() body: UpdateProjectBodyDto,
  ) {
    return await this.projectService.update({
      projectId: Number(projectId),
      ...body,
    });
  }

  @Patch(':projectId/change-owner')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_CHANGE_OWNER)
  @UseInterceptors(TransactionInterceptor)
  public async changeOwner(
    @Param('projectId') projectId,
    @Body() body: ChangeOwnerBodyDto,
  ) {
    return await this.projectService.changeOwner({
      projectId: Number(projectId),
      ...body,
    });
  }
}
