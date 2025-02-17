import { IsDefined, IsOptional, IsString } from 'class-validator';
import { Brackets } from 'typeorm';
import { BuilderOptionsDto } from '@/common/utils/builder/dto/builder-options.dto';

export class BuilderFilterDto<T> {
  @IsDefined()
  @IsString()
  field: keyof T;

  @IsDefined()
  value: any | any[];

  @IsOptional()
  @IsString()
  operator?: 'and' | 'or';

  @IsOptional()
  callback?: (filter: BuilderOptionsDto<T>) => Brackets;
}
