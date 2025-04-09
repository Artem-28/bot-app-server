import { IsDefined, IsNumber, validateSync } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DomainError } from '@/common/error';
import { ParamProject } from '@/common/param/param-project.transformer';

export class ParamSubscriber extends ParamProject {
  @IsNumber()
  @IsDefined()
  user_id: number;
}

export const ParamSubscriberTransformer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const param = new ParamSubscriber();
    param.project_id = Number(request.params.project_id);
    param.user_id = Number(request.params.user_id);

    const errors = validateSync(param, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return param;
  },
);
