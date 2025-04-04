import { IsDefined, IsNumber } from 'class-validator';

export class RemoveSubscriberDto {
  @IsDefined()
  @IsNumber()
  subscriber_id: number;

  @IsDefined()
  @IsNumber()
  project_id: number;
}
