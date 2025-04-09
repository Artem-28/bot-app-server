import { IsDefined, IsNumber, validateSync } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DomainError } from '@/common/error';
import { ParamProject } from '@/common/param/param-project.transformer';

export class ParamRespondent extends ParamProject {
  @IsNumber()
  @IsDefined()
  respondent_id: number;
}

export const ParamRespondentTransformer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const param = new ParamRespondent();
    param.project_id = Number(request.params.project_id);
    param.respondent_id = Number(request.params.respondent_id);

    const errors = validateSync(param, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return param;
  },
);
