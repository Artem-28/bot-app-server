import {
  IsDefined,
  IsString,
} from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsDefined()
  login: string;

  @IsString()
  @IsDefined()
  password: string;
}
