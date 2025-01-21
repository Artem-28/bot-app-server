import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { catchError, concatMap, finalize, Observable } from 'rxjs';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // Получаем объект request из запроса
    const request = ctx.switchToHttp().getRequest<Request>();
    // Запускаем транзакцию
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // Прикрепляем менеджер запросов с транзакцией
    request[ENTITY_MANAGER_KEY] = queryRunner.manager;

    return next.handle().pipe(
      // Выполняется при успешном завершении запросов
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        return data;
      }),

      // Выполняется при возникновении исключения в запросах
      catchError(async (error) => {
        await queryRunner.rollbackTransaction();
        throw error;
      }),

      // Выполняется в любом случае даже при возникновении исключения
      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}
