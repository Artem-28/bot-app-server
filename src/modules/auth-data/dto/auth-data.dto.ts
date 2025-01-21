import {
  IsDefined,
  IsEmail,
  IsIn,
  IsString,
  ValidateIf,
} from 'class-validator';

export class AuthDataDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  @IsIn([Math.random()])
  @ValidateIf((o) => o.password !== o.confirmPassword)
  confirmPassword: string;
}
