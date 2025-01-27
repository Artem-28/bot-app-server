import { IsDefined, IsEmail, IsEnum } from 'class-validator';
import { ConfirmCodeTypeEnum } from '@/models/confirm-code';

export class SendMessageDto {
  @IsEnum(ConfirmCodeTypeEnum)
  type: ConfirmCodeTypeEnum;

  @IsEmail()
  @IsDefined()
  email: string;
}
