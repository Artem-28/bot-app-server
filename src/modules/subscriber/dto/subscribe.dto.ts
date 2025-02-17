import { IsString, IsEmail, IsDefined } from 'class-validator';

export class SubscribeDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;
}
