import { IsDefined, IsNumber } from 'class-validator';

export class AuthMessengerDto {
  @IsNumber()
  @IsDefined()
  project_id: number;

  @IsNumber()
  @IsDefined()
  script_id: number;

  @IsDefined()
  fingerprint: string | string[];
}
