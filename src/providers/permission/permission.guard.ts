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
import { HQueryBuilder } from '@/common/utils/builder';
import { UserPermissionEntity } from '@/models/user-permission';
import { IUser } from '@/models/user';
import { ParamProject } from '@/common/param';

@Injectable()
export class PermissionGuard implements CanActivate {
  private _access: AccessController;
  private _params: ParamProject;
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
    this.setParams(ctx);
    return await this.check(accessController);
  }

  private setParams(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    this._authUser = request.user;
    this._params = new ParamProject();
    this._params.project_id = request.params.project_id;
  }

  private async check(accessController: AccessController) {
    this._access = accessController;

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
    const { project_id } = this._params;
    if (!project_id) return;

    const repository =
      await this._dataSource.manager.getRepository(ProjectEntity);

    const query = HQueryBuilder.select(repository, {
      filter: { field: 'id', value: project_id },
    });

    const project = await query.builder.getOne();
    if (!project) return;

    this._project = ProjectAggregate.create(project);
  }

  private async loadPermissions() {
    const { project_id } = this._params;
    const permissions = this._access.permissions;
    if (!project_id || !this._authUser || !permissions.length) return;
    const repository =
      this._dataSource.manager.getRepository(UserPermissionEntity);
    const query = HQueryBuilder.select(repository, {
      filter: [
        { field: 'project_id', value: permissions },
        { field: 'user_id', value: this._authUser.id, operator: 'and' },
        { field: 'code', value: permissions, operator: 'and' },
      ],
    });
    const result = await query.builder.getMany();
    this._permissions = result.map((p) => p.code);
  }
}
