import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class FingerprintMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Собираем данные из запроса
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const ip = req['ip'] || req.headers['x-forwarded-for'] || '';
    const acceptHeaders = req.headers['accept'] || '';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Создаем строку для хеширования
    const fingerprintString = `${userAgent}-${acceptLanguage}-${ip}-${acceptHeaders}-${timezone}`;

    // Генерируем хеш (fingerprint)
    req['fingerprint'] = crypto
      .createHash('sha256') // Используем SHA-256 для хеширования
      .update(fingerprintString)
      .digest('hex');

    // Передаем управление следующему middleware/контроллеру
    next();
  }
}
