import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsNumber()
  ownerId: number;
}
