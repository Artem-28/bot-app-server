import { IsDefined, IsEmail, IsNumber } from 'class-validator';

export class CreateSubscriberDto {
  @IsDefined()
  @IsNumber()
  project_id: number;

  @IsDefined()
  @IsEmail()
  email: string;
}
