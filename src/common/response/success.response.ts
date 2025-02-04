import { ArgumentsHost } from '@nestjs/common';
import { IResponse } from '@/common/response/respomse.interface';

export class SuccessResponse<T> implements IResponse {
  path: string;
  success: boolean;
  statusCode: number;
  data: T | T[];

  static create<T>(data: T | T[], host: ArgumentsHost) {
    const response = new SuccessResponse<T>();
    const ctx = host.switchToHttp();
    const ctxResponse = ctx.getResponse();
    const ctxRequest = ctx.getRequest();

    response.data = data;
    response.statusCode = ctxResponse.statusCode;
    response.path = ctxRequest.route.path;
    response.success = response.statusCode <= 201;
    return response;
  }
}
