import { IsDefined, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IProject } from '@/models/project/project.interface';
import { BaseAggregate } from '@/models/base';
import { IUser } from '@/models/user';


export class ProjectAggregate
  extends BaseAggregate<IProject>
  implements IProject
{
  @IsDefined()
  @IsNumber()
  @Exclude()
  owner_id: number;

  @IsDefined()
  @IsString()
  title: string;

  owner: Partial<IUser>;

  static create(data: Partial<IProject>) {
    const _entity = new ProjectAggregate();
    _entity.update(data)
    return _entity;
  }

  public setOwner(user: IUser) {
    this.owner_id = user.id;
    Object.assign(this.owner, user);
  }

  get instance(): IProject {
    return {
      id: this.id,
      owner_id: this.owner_id,
      title: this.title,
      crated_at: this.crated_at,
      updated_at: this.updated_at,
    };
  }
}
