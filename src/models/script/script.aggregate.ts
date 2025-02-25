import { IsDefined, IsNumber, IsString, validateSync } from 'class-validator';
import { DomainError } from '@/common/error';
import { BaseAggregate } from '@/models/base';
import { IScript } from '@/models/script/script.interface';

export class ScriptAggregate extends BaseAggregate<IScript> implements IScript {
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsDefined()
  @IsString()
  title: string;

  static create(data: Partial<IScript>) {
    const _script = new ScriptAggregate();
    Object.assign(_script, data);
    _script.updatedAt = data?.id ? new Date() : _script.updatedAt;
    const errors = validateSync(_script, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return _script;
  }

  get instance(): IScript {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
