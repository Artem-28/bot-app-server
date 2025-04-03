import { IRespondent } from '@/models/respondent';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateRespondentDto {
  @IsString()
  @IsOptional()
  name?: string | null;

  @IsString()
  @IsOptional()
  surname?: string | null;

  @IsString()
  @IsOptional()
  patronymic?: string | null;

  @IsEmail()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  phone?: string | null;
}

export class CreateRespondentDto extends UpdateRespondentDto {
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsArray()
  fingerprints?: string[];
}
