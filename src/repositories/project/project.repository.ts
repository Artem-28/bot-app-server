import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource } from 'typeorm';
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

  async update(id: number, data: Partial<IProject>): Promise<boolean> {
    const result = await this.getRepository(ProjectEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where({ id })
      .execute();
    return !!result.affected;
  }

  async remove(id: number): Promise<boolean> {
    const repository = this.getRepository(ProjectEntity);
    const query = HQueryBuilder.select(repository, {
      filter: { field: 'id', value: id },
    });

    const result = await query.builder.execute();
    return !!result.affected;
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
