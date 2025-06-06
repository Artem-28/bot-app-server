import { IsDefined, IsNumber } from 'class-validator';

export class ConnectionDto {
  @IsNumber()
  @IsDefined()
  script_id: number;

  @IsDefined()
  fingerprint: string | string[];
}
