import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseAggregate } from '@/models/base';
import { IScript } from '@/models/script/script.interface';

export class ScriptAggregate extends BaseAggregate<IScript> implements IScript {
  @IsDefined()
  @IsNumber()
  project_id: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string;

  static create(data: Partial<IScript>) {
    const _entity = new ScriptAggregate();
    _entity.update(data);
    return _entity;
  }

  get instance(): IScript {
    return {
      id: this.id,
      project_id: this.project_id,
      title: this.title,
      crated_at: this.crated_at,
      updated_at: this.updated_at,
    };
  }
}
