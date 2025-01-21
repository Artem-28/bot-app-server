import { ErrorResponse, SuccessResponse } from '@/common/response';
import { ArgumentsHost, ExecutionContext } from '@nestjs/common';

export class ResponseFactory {
  static success<T>(data: T | T[], ctx: ExecutionContext) {
    return new SuccessResponse(data, ctx);
  }

  static error(exception: any, host: ArgumentsHost) {
    console.log('EXCEPTION FACTORY', exception);
    return new ErrorResponse(exception, host);
  }
}
