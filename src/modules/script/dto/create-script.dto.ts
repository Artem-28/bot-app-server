import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateScriptDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string;
}
