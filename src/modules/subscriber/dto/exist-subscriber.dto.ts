import { IsDefined, IsNumber } from 'class-validator';

export class ExistSubscriberDto {
  @IsDefined()
  @IsNumber()
  userId: number;

  @IsDefined()
  @IsNumber()
  projectId: number;
}
