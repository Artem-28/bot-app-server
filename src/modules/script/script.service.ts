import { Injectable } from '@nestjs/common';
import { ScriptRepository } from '@/repositories/script';
import { CreateScriptDto } from '@/modules/script/dto';
import { ScriptAggregate } from '@/models/script';

@Injectable()
export class ScriptService {
  constructor(private readonly _scriptRepository: ScriptRepository) {}

  public create(dto: CreateScriptDto) {
    return this._scriptRepository.create(ScriptAggregate.create(dto).instance);
  }
}
