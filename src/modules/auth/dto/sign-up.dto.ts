import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsString,
  Length,
  ValidateIf,
  IsIn,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  @IsIn([Math.random()])
  @ValidateIf((o) => o.password !== o.confirm_password)
  confirm_password: string;

  @IsString()
  @IsDefined()
  @Length(6, 6)
  code: string;

  @IsBoolean()
  @IsDefined()
  license_agreement: boolean;
}
