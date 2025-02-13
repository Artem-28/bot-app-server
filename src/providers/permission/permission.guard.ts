import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '@/providers/permission/permission.decorator';
import { DataSource } from 'typeorm';
import {
  AccessController,
  AccessPermission,
  PermissionType,
} from '@/providers/permission/permission.type';
import { ProjectAggregate, ProjectEntity } from '@/models/project';
import { HQueryBuilder } from '@/common/utils/database';
import { ParamsDto } from '@/common/dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  private _access: AccessController;
  private _params: ParamsDto;
  private _project: ProjectAggregate;
  constructor(
    private readonly _reflector: Reflector,
    private readonly _dataSource: DataSource,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const accessController = this._reflector.get(
      PERMISSION_KEY,
      ctx.getHandler(),
    );
    const params = this.getParams(ctx);
    return await this.check(accessController, params);
  }

  private getParams(ctx: ExecutionContext): ParamsDto {
    const request = ctx.switchToHttp().getRequest();
    return Object.entries(
      Object.assign({ userId: request.user.id }, request.params),
    ).reduce((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {}) as ParamsDto;
  }

  private async check(accessController: AccessController, params: ParamsDto) {
    this._access = accessController;
    this._params = params;

    await this.loadJoinProject();
    if (!this._project) return false;

    const method = this._access.operator === 'and' ? 'every' : 'some';
    return this._access.permissions[method]((p) => this.checkPermission(p));
  }

  private checkPermission(permission: AccessPermission) {
    switch (permission) {
      case PermissionType.OWNER:
        return this.checkProjectOwner();
      default:
        return false;
    }
  }

  private checkProjectOwner() {
    return this._project && this._project.ownerId === this._params.userId;
  }

  private async loadJoinProject() {
    const { projectId } = this._params;
    if (!projectId) return;

    const repository =
      await this._dataSource.manager.getRepository(ProjectEntity);

    const query = new HQueryBuilder(repository, {
      filter: { field: 'id', value: projectId },
    });

    const project = await query.builder.getOne();
    if (!project) return;

    this._project = ProjectAggregate.create(project);
  }
}
