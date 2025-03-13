import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OperatorConnectionDto {
  @IsNumber()
  @IsDefined()
  projectId: number;

  @IsNumber()
  @IsDefined()
  userId: number;
}

export class RespondentConnectionBodyDto {
  @IsNumber()
  @IsDefined()
  scriptId: number;
}

export class RespondentConnectionDto extends RespondentConnectionBodyDto {
  @IsNumber()
  @IsDefined()
  projectId: number;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  fingerprint: string;
}
