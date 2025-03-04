import { IRespondent } from '@/models/respondent';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateRespondentDto
  implements
    Partial<Omit<IRespondent, 'projectId' | 'id' | 'createdAt' | 'updatedAt'>>
{
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
