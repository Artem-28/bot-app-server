import { IsDefined, IsNumber } from 'class-validator';

export class UnsubscribeDto {
  @IsDefined()
  @IsNumber()
  userId: number;

  @IsDefined()
  @IsNumber()
  projectId: number;
}
