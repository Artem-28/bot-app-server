import { Injectable } from '@nestjs/common';
import { ScriptRepository } from '@/repositories/script';
import { CreateScriptDto, UpdateScriptDto } from '@/modules/script/dto';
import { ScriptAggregate } from '@/models/script';
import { CommonError, errors } from '@/common/error';
import { ParamProject, ParamScript } from '@/common/param';

@Injectable()
export class ScriptService {
  constructor(private readonly _scriptRepository: ScriptRepository) {}

  public create(param: ParamProject, dto: CreateScriptDto) {
    const script = ScriptAggregate.create({
      ...param,
      ...dto,
    });
    return this._scriptRepository.create(script.instance);
  }

  public async update(param: ParamScript, dto: UpdateScriptDto) {
    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: param.script_id },
        { field: 'project_id', value: param.project_id, operator: 'and' },
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

  public async info(param: ParamScript) {
    const script = await this._scriptRepository.getOne({
      filter: [
        { field: 'id', value: param.script_id },
        { field: 'project_id', value: param.project_id, operator: 'and' },
      ],
    });

    if (!script) {
      throw new CommonError({ messages: errors.script.not_found });
    }

    return script;
  }

  public projectScripts(param: ParamProject) {
    return this._scriptRepository.getMany({
      filter: { field: 'project_id', value: param.project_id },
    });
  }

  public async remove(param: ParamScript) {
    const result = await this._scriptRepository.remove({
      filter: [
        { field: 'id', value: param.script_id },
        { field: 'project_id', value: param.project_id, operator: 'and' },
      ],
    });
    const success = result.affected > 0;
    if (!success) {
      throw new CommonError({ messages: errors.script.remove });
    }
  }
}
