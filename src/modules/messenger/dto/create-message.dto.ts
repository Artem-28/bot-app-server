import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsDefined()
  @IsNumber()
  session_id: number;

  @IsNumber()
  @IsOptional()
  operator_id?: number;

  @IsString()
  @IsOptional()
  text?: string;
}
