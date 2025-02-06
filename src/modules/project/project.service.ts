import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@/repositories/project';
import { CreateProjectDto } from '@/modules/project/dto';
import { ProjectAggregate } from '@/models/project';
import { CommonError, errors } from '@/common/error';
import { SubscriberRepository } from '@/repositories/subscriber';

@Injectable()
export class ProjectService {
  constructor(
    private readonly _projectRepository: ProjectRepository,
    private readonly _subscriberRepository: SubscriberRepository,
  ) {}

  public async create(dto: CreateProjectDto) {
    const project = ProjectAggregate.create(dto);
    return await this._projectRepository.create(project.instance);
  }

  public async info(id: number, throwException = false) {
    const project = await this._projectRepository.getOne({
      field: 'id',
      value: id,
    });
    if (!project && throwException) {
      throw new CommonError({
        target: 'app',
        messages: errors.project.not_found,
      });
    }

    return project;
  }

  public async viewProjects(userId: number) {
    const subscribers = await this._subscriberRepository.getMany({
      field: 'userId',
      value: userId,
    });

    const projectIds = subscribers.map((subscriber) => subscriber.projectId);

    return await this._projectRepository.getMany([
      { field: 'id', value: projectIds },
      { field: 'ownerId', value: userId, operator: 'or' },
    ]);
  }
}
