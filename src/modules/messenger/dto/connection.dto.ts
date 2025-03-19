import { IsDefined, IsNumber } from 'class-validator';

export class ConnectionDto {
  @IsNumber()
  @IsDefined()
  projectId: number;

  @IsNumber()
  @IsDefined()
  scriptId: number;

  @IsDefined()
  fingerprint: string;
}
