import { ArgumentsHost } from '@nestjs/common';
import { IResponse } from '@/common/response/respomse.interface';
import { ExceptionAggregate, IException } from '@/common/error';

export class ErrorResponse implements IResponse {
  path: string;
  success: boolean;
  statusCode: number;
  errors: IException[] = [];
  messages: string[] = [];

  static create(exception: any, host: ArgumentsHost) {
    console.log('EXCEPTION', exception);
    const response = new ErrorResponse();

    const error = ExceptionAggregate.create(exception);
    const errorResponse = error.getResponse();

    const ctx = host.switchToHttp();
    const ctxRequest = ctx.getRequest();

    response.errors = errorResponse.errors;
    response.messages = errorResponse.messages;
    response.statusCode = error.getStatus();
    response.path = ctxRequest.route.path;
    response.success = response.statusCode <= 201;

    return response;
  }
}
