import {
  BuilderOptionsDto,
  DeleteBuilderOptions,
} from '@/common/utils/builder';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IScript, ScriptAggregate } from '@/models/script';

export abstract class ScriptRepositoryDomain {
  abstract create(data: IScript): Promise<ScriptAggregate>;
  abstract update(id: number, data: Partial<IScript>): Promise<UpdateResult>;

  abstract getOne(
    options?: BuilderOptionsDto<IScript>,
  ): Promise<ScriptAggregate | null>;

  abstract getMany(
    options?: BuilderOptionsDto<IScript>,
  ): Promise<ScriptAggregate[]>;

  abstract remove(
    options: DeleteBuilderOptions<IScript>,
  ): Promise<DeleteResult>;
}
