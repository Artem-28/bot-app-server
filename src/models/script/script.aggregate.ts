import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { BaseAggregate } from '@/models/base';
import { IScript } from '@/models/script/script.interface';
import { UpdateScriptDto } from '@/modules/script/dto';

export class ScriptAggregate extends BaseAggregate<IScript> implements IScript {
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string;

  static create(data: Partial<IScript>) {
    const _script = new ScriptAggregate();
    Object.assign(_script, data);
    _script.createdAt = data?.id ? _script.createdAt : new Date();
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
