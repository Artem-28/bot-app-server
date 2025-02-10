import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProjectBodyDto {
  @IsString()
  @IsOptional()
  title?: string;
}

export class UpdateProjectDto extends UpdateProjectBodyDto {
  @IsDefined()
  @IsNumber()
  projectId: number;
}
