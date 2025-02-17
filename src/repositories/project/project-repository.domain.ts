import { IProject, ProjectAggregate } from '@/models/project';
import { BuilderOptionsDto } from '@/common/utils/builder';

export abstract class ProjectRepositoryDomain {
  abstract create(project: IProject): Promise<ProjectAggregate>;
  abstract update(id: number, data: Partial<IProject>): Promise<boolean>;

  abstract getOne(
    options?: BuilderOptionsDto<IProject>,
  ): Promise<ProjectAggregate | null>;

  abstract getMany(
    options?: BuilderOptionsDto<IProject>,
  ): Promise<ProjectAggregate[]>;

  abstract remove(id: number): Promise<boolean>;
}
