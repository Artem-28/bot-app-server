import { IsDefined, IsNumber, IsOptional } from 'class-validator';

export class StartChatDto {
  @IsNumber()
  @IsDefined()
  scriptId: number;

  @IsNumber()
  @IsOptional()
  respondentId?: number;
}
