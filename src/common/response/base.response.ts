import { ArgumentsHost } from '@nestjs/common';

export class BaseResponse {
  public success: boolean;
  public statusCode: number;
  public path: string;

  constructor(host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    this.statusCode = response.statusCode;
    this.path = request.route.path;
    this.success = this.statusCode <= 201;
  }
}
