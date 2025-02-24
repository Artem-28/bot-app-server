import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import {DataSource, DeleteResult, UpdateResult} from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ProjectRepositoryDomain } from '@/repositories/project/project-repository.domain';
import { IProject, ProjectAggregate, ProjectEntity } from '@/models/project';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';

@Injectable()
export class ProjectRepository
  extends BaseRepository
  implements ProjectRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
    super(dataSource, request);
  }

  async create(project: IProject): Promise<ProjectAggregate> {
    const result = await this.getRepository(ProjectEntity).save(project);
    return ProjectAggregate.create(result);
  }

  async getOne(
    options?: BuilderOptionsDto<IProject>,
  ): Promise<ProjectAggregate | null> {
    const repository = this.getRepository(ProjectEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return ProjectAggregate.create(result);
  }

  update(id: number, data: Partial<IProject>): Promise<UpdateResult> {
    return this.getRepository(ProjectEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where({ id })
      .execute();
  }

  remove(id: number): Promise<DeleteResult> {
    const repository = this.getRepository(ProjectEntity);
    const query = HQueryBuilder.delete(repository, {
      filter: { field: 'id', value: id },
    });

    return query.builder.execute();
  }

  async getMany(
    options?: BuilderOptionsDto<IProject>,
  ): Promise<ProjectAggregate[]> {
    const repository = this.getRepository(ProjectEntity);
    const query = HQueryBuilder.select(repository, options);
    const result = await query.builder.getMany();
    if (!result) return null;
    return result.map((item) => ProjectAggregate.create(item));
  }
}
