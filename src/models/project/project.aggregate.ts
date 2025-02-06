import {
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { IProject } from '@/models/project/project.interface';
import { BaseAggregate } from '@/models/base';

export class ProjectAggregate extends BaseAggregate implements IProject {
  @IsDefined()
  @IsNumber()
  ownerId: number;

  @IsDefined()
  @IsString()
  title: string;

  static create(data: Partial<IProject>) {
    const _project = new ProjectAggregate();
    Object.assign(_project, data);
    _project.updatedAt = data?.id ? new Date() : _project.updatedAt;
    const errors = validateSync(_project, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return _project;
  }

  get instance(): IProject {
    return {
      id: this.id,
      ownerId: this.ownerId,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
