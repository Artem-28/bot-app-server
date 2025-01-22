import { JwtModuleOptions } from '@nestjs/jwt';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

export const jwtConfig: JwtModuleOptions = {
  global: true,
  secret: configService.get('JWT_SECRET'),
  signOptions: { expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRES') },
};
