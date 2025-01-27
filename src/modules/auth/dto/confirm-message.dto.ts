import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  destination: string;
}
