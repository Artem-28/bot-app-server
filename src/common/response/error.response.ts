import { BaseResponse } from '@/common/response/base.response';
import { ArgumentsHost } from '@nestjs/common';
import { getExceptionErrors, getExceptionStatus, IError } from '@/common/error';

export class ErrorResponse extends BaseResponse {
  public errors: IError[];

  constructor(exception: any, host: ArgumentsHost) {
    super(host);
    this.errors = getExceptionErrors(exception);
    this.statusCode = getExceptionStatus(exception);
    this.success = false;
  }
}
