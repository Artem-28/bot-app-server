import { BaseResponse } from '@/common/response/base.response';
import { ExecutionContext } from '@nestjs/common';

export class SuccessResponse<T> extends BaseResponse {
  data: T | T[];
  constructor(data: T | T[], ctx: ExecutionContext) {
    super(ctx);
    this.data = data;
  }
}
