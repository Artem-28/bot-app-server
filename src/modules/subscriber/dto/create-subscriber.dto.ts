import { IsDefined, IsEmail, IsNumber } from 'class-validator';

export class CreateSubscriberDto {
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsDefined()
  @IsEmail()
  email: string;
}
