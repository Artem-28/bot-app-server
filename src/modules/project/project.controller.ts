import {
  Body,
  Controller,
  Get,
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
import { ParamProject, ParamProjectTransformer } from '@/common/param';

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

  @Get(':project_id')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_INFO)
  public async info(@ParamProjectTransformer() param: ParamProject) {
    return await this.projectService.info(param.project_id, true);
  }

  @Patch(':project_id')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_UPDATE)
  public async update(
    @ParamProjectTransformer() param: ParamProject,
    @Body() body: UpdateProjectBodyDto,
  ) {
    return await this.projectService.update({
      ...param,
      ...body,
    });
  }

  @Delete(':project_id')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_REMOVE)
  @UseInterceptors(TransactionInterceptor)
  public async remove(@ParamProjectTransformer() param: ParamProject) {
    const success = await this.projectService.remove(param.project_id, true);
    await this.permissionService.removeProjectPermissions(param.project_id);
    return success;
  }

  @Patch(':project_id/change-owner')
  @UseGuards(PermissionGuard)
  @Permission(PROJECT_CHANGE_OWNER)
  @UseInterceptors(TransactionInterceptor)
  public async changeOwner(
    @ParamProjectTransformer() param: ParamProject,
    @Body() body: ChangeOwnerBodyDto,
  ) {
    const project = await this.projectService.changeOwner({
      ...param,
      ...body,
    });
    await this.permissionService.remove({
      ...param,
      user_id: project.owner_id,
    });

    return project;
  }
}
