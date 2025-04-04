import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsBoolean()
  @IsDefined()
  license_agreement: boolean;

  @IsOptional()
  @IsString()
  phone?: string;
}
