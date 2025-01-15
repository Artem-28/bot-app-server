import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Configuration
import configuration from '@/config/configuration';
import typeorm from '@/config/typeorm';

// Controller
import { AppController } from '@/app.controller';

// Service
import { AppService } from '@/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, typeorm],
      isGlobal: true, // Включение\отключение глобальной обрасти для конфига .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
