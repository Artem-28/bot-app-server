import { IsOptional, IsString } from 'class-validator';
import { IOrder, IPagination } from '@/common/types';
import { BuilderFilterDto } from '@/common/utils/builder/dto/builder-filter.dto';
import { BuilderRelationDto } from '@/common/utils/builder/dto/builder-relation.dto';

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
