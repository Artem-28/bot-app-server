import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
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
  PROJECT_REMOVE,
  PROJECT_UPDATE,
} from '@/providers/permission';
import {
  ChangeOwnerBodyDto,
  CreateProjectBodyDto,
  UpdateProjectBodyDto,
} from '@/modules/project/dto';
import { TransactionInterceptor } from '@/common/interceptors';
import { PermissionService } from '@/modules/permission/permission.service';

@Controller('api/v1/projects')
@UseGuards(JwtGuard)
export class ProjectController {
  constructor(
    readonly projectService: ProjectService,
    readonly permissionService: PermissionService,
  ) {}

  @Post()
  public async create(@Req() req, @Body() body: CreateProjectBodyDto) {
    return await this.projectService.create({ owner: req.user, ...body });
  }

  @Get()
  public async list(@Req() req) {
    const userId = Number(req.user.id);
    return await this.projectService.viewProjects(userId);
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

  @Delete(':projectId')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_REMOVE)
  @UseInterceptors(TransactionInterceptor)
  public async remove(@Param('projectId') projectId) {
    const success = await this.projectService.remove(projectId, true);
    await this.permissionService.removeProjectPermissions(projectId);
    return success;
  }

  @Patch(':projectId/change-owner')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_CHANGE_OWNER)
  @UseInterceptors(TransactionInterceptor)
  public async changeOwner(
    @Param('projectId') projectId,
    @Body() body: ChangeOwnerBodyDto,
  ) {
    const project = await this.projectService.changeOwner({
      projectId: Number(projectId),
      ...body,
    });
    await this.permissionService.update({
      projectId: project.id,
      userId: project.ownerId,
      permissions: [],
    });

    return project;
  }
}
