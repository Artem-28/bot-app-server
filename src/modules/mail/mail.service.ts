import { Injectable } from '@nestjs/common';
import { ConfirmCodeTypeEnum } from '@/models/confirm-code';
import { ConfigService } from '@nestjs/config';
import { SendMessageDto } from '@/modules/mail/dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CommonError } from '@/common/error';

@Injectable()
export class MailService {
  private readonly _mailOptions = {
    [ConfirmCodeTypeEnum.REGISTRATION]: {
      from: this._configService.get('MAIL_USERNAME'),
      subject: 'Подтверждение регистрации',
      template: 'registration',
    },
    [ConfirmCodeTypeEnum.UPDATE_PASSWORD]: {
      from: this._configService.get('MAIL_USERNAME'),
      subject: 'Изменение пароля',
      template: 'update-password',
    },
  };

  constructor(
    private readonly _configService: ConfigService,
    private readonly _mailerService: MailerService,
  ) {}

  public async sendMessage(dto: SendMessageDto, context: any) {
    try {
      return await this._mailerService.sendMail({
        ...this._mailOptions[dto.type],
        to: dto.email,
        context: context,
      });
    } catch (e) {
      console.log('ERROR', e);
      throw new CommonError(
        {
          ctx: 'app',
          field: null,
          message: `errors.mail.send_message.${dto.type}`,
        },
        400,
      );
    }
  }
}
