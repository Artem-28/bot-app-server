import { IsDefined, IsNumber, validateSync } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DomainError } from '@/common/error';
import { ParamProject } from '@/common/param/param-project.transformer';

export class ParamScript extends ParamProject {
  @IsNumber()
  @IsDefined()
  script_id: number;
}

export const ParamScriptTransformer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const param = new ParamScript();
    param.project_id = Number(request.params.project_id);
    param.script_id = Number(request.params.script_id);

    const errors = validateSync(param, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return param;
  },
);
