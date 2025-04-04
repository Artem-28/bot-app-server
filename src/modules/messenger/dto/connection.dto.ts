import { IsDefined, IsNumber, IsString } from 'class-validator';

export class ConnectionDto {
  @IsString()
  @IsDefined()
  client_id: string;

  @IsNumber()
  @IsDefined()
  project_id: number;
}

export class OperatorConnectionDto extends ConnectionDto {
  @IsString()
  @IsDefined()
  operator_login: string;
}

export class RespondentConnectionDto extends ConnectionDto {
  @IsNumber()
  @IsDefined()
  session_id: number;
}
