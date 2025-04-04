import { IsDefined, IsNumber } from 'class-validator';

export class UnsubscribeDto {
  @IsDefined()
  @IsNumber()
  user_id: number;

  @IsDefined()
  @IsNumber()
  project_id: number;
}
