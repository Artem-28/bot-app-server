import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';
import { Request } from 'express';

@Injectable()
export class FingerprintInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();

    // Собираем данные из запроса
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const ip = req['ip'] || req.headers['x-forwarded-for'] || '';
    const acceptHeaders = req.headers['accept'] || '';

    // Попытка получить таймзону. Защита от ошибок, если ее нет
    let timezone: string = '';
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      timezone = 'UTC'; // Или любое другое значение по умолчанию
      console.warn('Could not determine timezone, defaulting to UTC', error);
    }

    // Создаем строку для хеширования
    const fingerprintString = `${userAgent}-${acceptLanguage}-${ip}-${acceptHeaders}-${timezone}`;

    // Генерируем хеш (fingerprint)
    req['fingerprint'] = crypto
      .createHash('sha256') // Используем SHA-256 для хеширования
      .update(fingerprintString)
      .digest('hex');

    // Возвращаем результат (Observable<any>), чтобы продолжить обработку запроса
    return next.handle();
  }
}
