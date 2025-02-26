import { IsDefined, IsNumber, IsString, validateSync } from 'class-validator';
import { DomainError } from '@/common/error';
import { IProject } from '@/models/project/project.interface';
import { BaseAggregate } from '@/models/base';
import { IUser } from '@/models/user';
import { Exclude } from 'class-transformer';

export class ProjectAggregate
  extends BaseAggregate<IProject>
  implements IProject
{
  @IsDefined()
  @IsNumber()
  @Exclude()
  ownerId: number;

  @IsDefined()
  @IsString()
  title: string;

  owner: Partial<IUser>;

  static create(data: Partial<IProject>) {
    const _project = new ProjectAggregate();
    Object.assign(_project, data);
    _project.createdAt = data?.id ? _project.createdAt : new Date();
    const errors = validateSync(_project, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }

    Object.assign(_project, { owner: { id: _project.ownerId } });
    return _project;
  }

  public setOwner(user: IUser) {
    this.ownerId = user.id;
    Object.assign(this.owner, user);
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
