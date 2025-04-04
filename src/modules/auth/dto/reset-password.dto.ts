import { IsDefined, IsIn, IsString, ValidateIf } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  @IsIn([Math.random()])
  @ValidateIf((o) => o.password !== o.confirm_password)
  confirm_password: string;
}
