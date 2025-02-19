import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/repositories/project';
import {
  ChangeOwnerDto,
  CreateProjectDto,
  UpdateProjectDto,
  ViewProjectDto,
} from '@/modules/project/dto';
import { ProjectAggregate } from '@/models/project';
import { CommonError, errors } from '@/common/error';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';
import { PermissionEnum } from '@/providers/permission';

@Injectable()
export class ProjectService {
  constructor(
    private readonly _projectRepository: ProjectRepository,
    private readonly _subscriberRepository: SubscriberRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async create(dto: CreateProjectDto) {
    const { owner, ...payload } = dto;
    const project = await this._projectRepository.create(
      ProjectAggregate.create({ ...payload, ownerId: owner.id }).instance,
    );
    project.setOwner(owner);
    return project;
  }

  public async update(dto: UpdateProjectDto) {
    const { projectId, ...payload } = dto;
    const project = await this._projectRepository.getOne({
      filter: { field: 'id', value: projectId },
    });

    if (!project) {
      throw new CommonError({
        target: 'app',
        messages: errors.project.not_found,
      });
    }

    project.update(payload);
    const success = await this._projectRepository.update(
      project.id,
      project.instance,
    );

    if (!success) {
      throw new CommonError({
        target: 'app',
        messages: errors.project.update,
      });
    }

    return project;
  }

  public async changeOwner(dto: ChangeOwnerDto) {
    // Получаем нового владельца проекта
    const user = await this._userRepository.getOne({
      filter: { field: 'email', value: dto.ownerEmail },
    });

    // Если нет такого пользователя возвращаем ошибку
    if (!user) {
      throw new CommonError({ messages: errors.user.not_exist });
    }

    // Получаем проект
    const project = await this._projectRepository.getOne({
      filter: { field: 'id', value: dto.projectId },
    });

    // Если такого проекта нет возвращаем ошибку
    if (!project) {
      throw new CommonError({ messages: errors.project.not_found });
    }

    // Устанавливаем нового владельца проекта
    project.setOwner(user);
    const success = await this._projectRepository.update(
      project.id,
      project.instance,
    );

    // Если не удалось обновить проект возвращаем ошибку
    if (!success) {
      throw new CommonError({
        target: 'app',
        messages: errors.project.update,
      });
    }

    // Удаляем пользователя из подписчиков на этом проекте если он им был
    await this._subscriberRepository.unsubscribe({
      projectId: project.id,
      userId: user.id,
    });

    return project;
  }

  public async info(id: number, throwException = false) {
    const project = await this._projectRepository.getOne({
      filter: { field: 'id', value: id },
    });
    if (!project && throwException) {
      throw new CommonError({
        target: 'app',
        messages: errors.project.not_found,
      });
    }

    const user = await this._userRepository.getOne({
      filter: { field: 'id', value: project.ownerId },
    });

    if (user) project.setOwner(user);

    return project;
  }

  public async viewProjects(dto: ViewProjectDto) {
    const projectIds: number[] = [];
    const viewPermissions = [PermissionEnum.READ_PROJECT];
    dto.readProjectPermissions.forEach((permission) => {
      const canProject =
        viewPermissions.includes(permission.code) &&
        permission.userId === dto.ownerId;

      if (!canProject) return;
      projectIds.push(permission.projectId);
    });

    return await this._projectRepository.getMany({
      filter: [
        { field: 'id', value: projectIds },
        { field: 'ownerId', value: dto.ownerId, operator: 'or' },
      ],
    });
  }

  public async remove(projectId) {
    const removed = await this._projectRepository.remove(projectId);
    // Удаляем всех подписчиков на этом проекте
    await this._subscriberRepository.remove({
      filter: { field: 'projectId', value: projectId },
    });

    return removed;
  }
}
