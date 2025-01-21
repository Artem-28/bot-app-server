import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ResponseFactory, SuccessResponse } from '@/common/response';
import { map, Observable } from 'rxjs';

export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> | Promise<Observable<SuccessResponse<T>>> {
    return next
      .handle()
      .pipe<
        SuccessResponse<T>
      >(map((data) => ResponseFactory.success<T>(data, context)));
  }
}
