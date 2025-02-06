import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/repositories/project';
import {
  AccessController,
  AccessPermission,
  PermissionType,
} from '@/providers/permission';
import { ParamsDto } from '@/modules/permission/dto';
import { ProjectAggregate } from '@/models/project';
import { SubscriberAggregate } from '@/models/subscriber';
import { SubscriberRepository } from '@/repositories/subscriber';

@Injectable()
export class PermissionService {
  private _project: ProjectAggregate;
  private _joinProject: SubscriberAggregate;
  private _access: AccessController;
  private _params: ParamsDto;
  constructor(
    private readonly _projectRepository: ProjectRepository,
    private readonly _subscriberRepository: SubscriberRepository,
  ) {}

  public async check(accessController: AccessController, params: ParamsDto) {
    this._access = accessController;
    this._params = params;

    await this.loadProject();
    if (!this._project) {
      await this.loadJoinProject();
    }
    if (!this._joinProject && !this._project) return false;

    const method = this._access.operator === 'and' ? 'every' : 'some';
    return this._access.permissions[method]((p) => this.checkPermission(p));
  }

  private checkPermission(permission: AccessPermission) {
    switch (permission) {
      case PermissionType.OWNER:
        return this.checkProjectOwner();
      case PermissionType.SUBSCRIBER:
        return this.checkSubscriberProject();
      default:
        return false;
    }
  }

  private checkProjectOwner() {
    return this._project && this._project.ownerId === this._params.userId;
  }

  private checkSubscriberProject() {
    return (
      this._joinProject && this._joinProject.userId === this._params.userId
    );
  }

  private async loadJoinProject() {
    const { userId, projectId } = this._params;
    if (!projectId || !userId) return;

    this._joinProject = await this._subscriberRepository.getOne([
      { field: 'projectId', value: projectId },
      { field: 'userId', value: userId, operator: 'and' },
    ]);
  }

  private async loadProject() {
    const { userId, projectId } = this._params;
    if (!projectId || !userId) return;

    this._project = await this._projectRepository.getOne([
      { field: 'id', value: projectId },
      { field: 'ownerId', value: userId, operator: 'and' },
    ]);
  }
}
