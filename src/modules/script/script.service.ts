import { Injectable } from '@nestjs/common';
import { ScriptRepository } from '@/repositories/script';
import { CreateScriptDto, UpdateScriptDto } from '@/modules/script/dto';
import { ScriptAggregate } from '@/models/script';
import { IProjectParam, IScriptParam } from '@/common/types';
import { CommonError, errors } from '@/common/error';

@Injectable()
export class ScriptService {
  constructor(private readonly _scriptRepository: ScriptRepository) {}

  public create(param: IProjectParam, dto: CreateScriptDto) {
    const script = ScriptAggregate.create({
      projectId: Number(param.projectId),
      ...dto,
    });
    return this._scriptRepository.create(script.instance);
  }

  public async update(param: IScriptParam, dto: UpdateScriptDto) {
    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: param.scriptId },
        { field: 'projectId', value: param.projectId, operator: 'and' },
      ],
    });

    if (!script) {
      throw new CommonError({ messages: errors.script.not_found });
    }

    const isEmptyDto = Object.keys(dto).length === 0;
    if (isEmptyDto) return script;

    script.update(dto);

    const result = await this._scriptRepository.update(
      script.id,
      script.instance,
    );

    const success = !!result.affected;
    if (!success) {
      throw new CommonError({ messages: errors.script.update });
    }

    return script;
  }

  public async info(param: IScriptParam) {
    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: param.scriptId },
        { field: 'projectId', value: param.projectId, operator: 'and' },
      ],
    });

    if (!script) {
      throw new CommonError({ messages: errors.script.not_found });
    }

    return script;
  }

  public projectScripts(param: IProjectParam) {
    return this._scriptRepository.getMany({
      filter: { field: 'projectId', value: param.projectId },
    });
  }

  public async remove(param: IScriptParam) {
    const result = await this._scriptRepository.remove({
      filter: [
        { field: 'id', value: param.scriptId },
        { field: 'projectId', value: param.projectId, operator: 'and' },
      ],
    });
    const success = result.affected > 0;
    if (!success) {
      throw new CommonError({ messages: errors.script.remove });
    }
  }
}
