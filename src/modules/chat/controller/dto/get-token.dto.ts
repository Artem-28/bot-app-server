import { IsDefined, IsString } from 'class-validator';

export class GetTokenDto {
  @IsDefined()
  @IsString()
  secretKey: string;
}
