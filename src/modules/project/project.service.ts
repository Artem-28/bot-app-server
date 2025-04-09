import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/repositories/project';
import {
  ChangeOwnerDto,
  CreateProjectDto,
  UpdateProjectDto,
} from '@/modules/project/dto';
import { ProjectAggregate } from '@/models/project';
import { CommonError, errors } from '@/common/error';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';
import { ScriptRepository } from '@/repositories/script';

@Injectable()
export class ProjectService {
  constructor(
    private readonly _projectRepository: ProjectRepository,
    private readonly _subscriberRepository: SubscriberRepository,
    private readonly _userRepository: UserRepository,
    private readonly _scriptRepository: ScriptRepository,
  ) {}

  public async create(dto: CreateProjectDto) {
    const { owner, ...payload } = dto;
    const project = await this._projectRepository.create(
      ProjectAggregate.create({ ...payload, owner_id: owner.id }).instance,
    );
    project.setOwner(owner);
    return project;
  }

  public async update(dto: UpdateProjectDto) {
    const { project_id, ...payload } = dto;
    const project = await this._projectRepository.getOne({
      filter: { field: 'id', value: project_id },
    });

    if (!project) {
      throw new CommonError({ messages: errors.project.not_found });
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
      filter: { field: 'email', value: dto.owner_email },
    });

    // Если нет такого пользователя возвращаем ошибку
    if (!user) {
      throw new CommonError({ messages: errors.user.not_exist });
    }

    // Получаем проект
    const project = await this._projectRepository.getOne({
      filter: { field: 'id', value: dto.project_id },
    });

    // Если такого проекта нет возвращаем ошибку
    if (!project) {
      throw new CommonError({ messages: errors.project.not_found });
    }

    // Устанавливаем нового владельца проекта
    project.setOwner(user);
    const result = await this._projectRepository.update(
      project.id,
      project.instance,
    );

    const success = result.affected > 0;

    // Если не удалось обновить проект возвращаем ошибку
    if (!success) {
      throw new CommonError({
        target: 'app',
        messages: errors.project.update,
      });
    }

    // Удаляем пользователя из подписчиков на этом проекте если он им был
    await this._subscriberRepository.remove({
      filter: [
        { field: 'project_id', value: project.id },
        { field: 'user_id', value: user.id },
      ],
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
      filter: { field: 'id', value: project.owner_id },
    });

    if (user) project.setOwner(user);

    return project;
  }

  public async viewProjects(userId: number) {
    const subscribeProjects = await this._subscriberRepository.getMany({
      filter: { field: 'user_id', value: userId },
    });

    const projectIds = subscribeProjects.map(
      (subscriber) => subscriber.project_id,
    );

    return await this._projectRepository.getMany({
      filter: [
        { field: 'id', value: projectIds },
        { field: 'owner_id', value: userId, operator: 'or' },
      ],
    });
  }

  public async remove(projectId: string | number, throwException = false) {
    projectId = Number(projectId);
    const result = await this._projectRepository.remove(projectId);

    const success = result.affected > 0;

    if (success) {
      // Удаляем всех подписчиков на этом проекте
      await this._subscriberRepository.remove({
        filter: { field: 'project_id', value: projectId },
      });

      // Удаляем все скрипты из проекта
      await this._scriptRepository.remove({
        filter: { field: 'project_id', value: projectId },
      });
    }

    if (!success && throwException) {
      throw new CommonError({ messages: errors.project.remove });
    }

    return success;
  }
}
