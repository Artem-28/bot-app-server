import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ConfirmCodeTypeEnum } from '@/models/confirm-code';

export class CheckConfirmCodeDto {
  @IsEnum(ConfirmCodeTypeEnum)
  type: ConfirmCodeTypeEnum;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  destination: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  code: string;
}
