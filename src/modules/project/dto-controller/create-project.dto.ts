import { IsDefined, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsDefined()
  @IsString()
  title: string;
}
