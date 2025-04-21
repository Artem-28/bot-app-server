import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RespondentMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text: string;
}

export class OperatorMessageDto {
  @IsDefined()
  @IsNumber()
  session_id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text: string;
}
