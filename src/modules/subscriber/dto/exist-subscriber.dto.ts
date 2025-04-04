import { IsDefined, IsNumber } from 'class-validator';

export class ExistSubscriberDto {
  @IsDefined()
  @IsNumber()
  user_id: number;

  @IsDefined()
  @IsNumber()
  project_id: number;
}
