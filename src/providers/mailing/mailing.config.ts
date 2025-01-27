import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { config } from 'dotenv';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

export const mailingConfig: MailerOptions = {
  transport: {
    host: configService.get('MAIL_HOST'),
    port: configService.get('MAIL_PORT'),
    secure: true,
    auth: {
      user: configService.get('MAIL_USERNAME'),
      pass: configService.get('MAIL_PASSWORD'),
    },
  },
  template: {
    dir: join(process.cwd(), 'src', 'modules', 'mail', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: { strict: true },
  },
};
