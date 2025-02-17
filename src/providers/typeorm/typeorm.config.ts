import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions & SeederOptions => {
  return {
    type: 'mysql',
    host: configService.get('MYSQL_DATABASE_HOST'),
    port: configService.get('MYSQL_DATABASE_PORT'),
    username: configService.get('MYSQL_USER'),
    password: configService.get<string>('MYSQL_PASSWORD'),
    database: configService.get<string>('MYSQL_DATABASE'),
    entities: [join(process.cwd(), 'dist', 'models', '**', '*.entity.js')],
    migrations: [
      join(
        process.cwd(),
        'dist',
        'data-base',
        'migrations',
        '**',
        '*.migration.js',
      ),
    ],
    seeds: [
      join(process.cwd(), 'dist', 'data-base', 'seeds', '**', '*.seed.js'),
    ],
    migrationsRun: true,
    // autoLoadEntities: true,
    migrationsTableName: 'migrations',
    logging: true,
    synchronize: false,
  } as DataSourceOptions & SeederOptions;
};

export const appDataSource = new DataSource(options());
