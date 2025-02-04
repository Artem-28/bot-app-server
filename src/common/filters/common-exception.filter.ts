import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorResponse } from '@/common/response';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const error = ErrorResponse.create(exception, host);
    response.status(error.statusCode).json(error);
  }
}
