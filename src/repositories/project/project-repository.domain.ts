import { FilterDto } from '@/common/dto';
import { IProject, ProjectAggregate } from '@/models/project';

export abstract class ProjectRepositoryDomain {
  abstract create(project: IProject): Promise<ProjectAggregate>;
  abstract update(
    id: number,
    data: Partial<Pick<IProject, 'title'>>,
  ): Promise<boolean>;

  abstract getOne(
    filter: FilterDto<IProject> | FilterDto<IProject>[],
  ): Promise<ProjectAggregate | null>;

  abstract getMany(
    filter: FilterDto<IProject> | FilterDto<IProject>[],
  ): Promise<ProjectAggregate[]>;

  abstract remove(id: number): Promise<boolean>;
}
