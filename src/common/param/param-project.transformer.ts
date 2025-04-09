import { IsDefined, IsNumber, validateSync } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DomainError } from '@/common/error';

export class ParamProject {
  @IsNumber()
  @IsDefined()
  project_id: number;
}

export const ParamProjectTransformer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const param = new ParamProject();
    param.project_id = Number(request.params.project_id);

    const errors = validateSync(param, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return param;
  },
);
