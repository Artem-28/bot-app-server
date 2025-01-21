import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ResponseFactory } from '@/common/response';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const error = ResponseFactory.error(exception, host);
    response.status(error.statusCode).json(error);
  }
}
