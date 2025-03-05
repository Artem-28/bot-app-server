import { IsDefined, IsNumber, IsOptional } from 'class-validator';

export class CreateChatSessionBodyDto {
  @IsNumber()
  @IsDefined()
  scriptId: number;

  @IsNumber()
  @IsOptional()
  respondentId?: number;
}

export class CreateChatSessionDto extends CreateChatSessionBodyDto {
  @IsNumber()
  @IsDefined()
  projectId: number;
}
