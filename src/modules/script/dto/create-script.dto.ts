import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateScriptBodyDto {
  @IsDefined()
  @IsString()
  title: string;
}

export class CreateScriptDto extends CreateScriptBodyDto {
  @IsDefined()
  @IsNumber()
  projectId: number;
}
