import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResponseInterceptor } from '@/common/interceptors';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonExceptionFilter } from '@/common/filters';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CommonExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class CommonModule {}
