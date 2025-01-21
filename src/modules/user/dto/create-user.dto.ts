import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsBoolean()
  @IsDefined()
  licenseAgreement: boolean;

  @IsOptional()
  @IsString()
  phone?: string;
}
