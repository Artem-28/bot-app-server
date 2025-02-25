import { IsDefined, IsNumber } from 'class-validator';

export class RemoveSubscriberDto {
  @IsDefined()
  @IsNumber()
  subscriberId: number;

  @IsDefined()
  @IsNumber()
  projectId: number;
}
