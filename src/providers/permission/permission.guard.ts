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
import { ParamsDto } from '@/common/dto';
import { HQueryBuilder } from '@/common/utils/builder';
import { UserPermissionEntity } from '@/models/user-permission';
import { IUser } from '@/models/user';

@Injectable()
export class PermissionGuard implements CanActivate {
  private _access: AccessController;
  private _params: ParamsDto;
  private _project: ProjectAggregate;
  private _permissions: AccessPermission[] = [];
  private _authUser: IUser;
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
    this._authUser = request.user;
    return Object.entries(request.params).reduce((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {}) as ParamsDto;
  }

  private async check(accessController: AccessController, params: ParamsDto) {
    this._access = accessController;
    this._params = params;

    await this.loadJoinProject();
    if (!this._project) return false;

    await this.loadPermissions();

    const method = this._access.operator === 'and' ? 'every' : 'some';
    return this._access.permissions[method]((p) => this.checkPermission(p));
  }

  private checkPermission(permission: AccessPermission) {
    switch (permission) {
      case PermissionType.OWNER:
        return this.checkProjectOwner();
      default:
        return this._permissions.includes(permission);
    }
  }

  private checkProjectOwner() {
    return this._project && this._project.owner_id === this._authUser.id;
  }

  private async loadJoinProject() {
    const { projectId } = this._params;
    if (!projectId) return;

    const repository =
      await this._dataSource.manager.getRepository(ProjectEntity);

    const query = HQueryBuilder.select(repository, {
      filter: { field: 'id', value: projectId },
    });

    const project = await query.builder.getOne();
    if (!project) return;

    this._project = ProjectAggregate.create(project);
  }

  private async loadPermissions() {
    const { projectId } = this._params;
    const permissions = this._access.permissions;
    if (!projectId || !this._authUser || !permissions.length) return;
    const repository =
      this._dataSource.manager.getRepository(UserPermissionEntity);
    const query = HQueryBuilder.select(repository, {
      filter: [
        { field: 'project_id', value: projectId },
        { field: 'user_id', value: this._authUser.id, operator: 'and' },
        { field: 'code', value: permissions, operator: 'and' },
      ],
    });
    const result = await query.builder.getMany();
    this._permissions = result.map((p) => p.code);
  }
}
