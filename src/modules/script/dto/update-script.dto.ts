import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateScriptDto } from '@/modules/script/dto/create-script.dto';

export class UpdateScriptDto implements Partial<CreateScriptDto> {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;
}
