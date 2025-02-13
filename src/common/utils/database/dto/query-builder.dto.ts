import { Brackets } from 'typeorm';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { IOrder, IPagination } from '@/common/types';

export class BuilderOptionsDto<T> {
  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  order?: IOrder | IOrder[];

  @IsOptional()
  filter?: BuilderFilterDto<T> | BuilderFilterDto<T>[];

  @IsOptional()
  pagination?: IPagination;

  @IsOptional()
  relation?: BuilderRelationDto | BuilderRelationDto[];
}

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

export class BuilderRelationDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  select?: string | string[];

  @IsOptional()
  @IsString()
  method?: BuilderRelationMethod;
}

export type BuilderRelationMethod =
  | 'leftJoinAndSelect'
  | 'innerJoinAndSelect'
  | 'innerJoin'
  | 'leftJoin';
