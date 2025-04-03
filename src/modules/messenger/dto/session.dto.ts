import { IsDefined, IsNumber } from 'class-validator';

export class SessionDto {
  @IsNumber()
  @IsDefined()
  project_id: number;

  @IsNumber()
  @IsDefined()
  script_id: number;

  @IsNumber()
  @IsDefined()
  respondent_id: number;
}
