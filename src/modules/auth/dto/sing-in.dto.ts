import { IsDefined, IsEmail, IsString } from 'class-validator';

export class SingInDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;
}
