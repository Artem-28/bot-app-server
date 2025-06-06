import { IsDefined, IsNumber, validateSync } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DomainError } from '@/common/error';
import { ParamScript } from '@/common/param/param-script.transformer';

export class ParamSession extends ParamScript {
  @IsNumber()
  @IsDefined()
  session_id: number;
}

export const ParamSessionTransformer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const param = new ParamSession();
    param.project_id = Number(request.params.project_id);
    param.script_id = Number(request.params.script_id);
    param.session_id = Number(request.params.session_id);

    const errors = validateSync(param, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return param;
  },
);
