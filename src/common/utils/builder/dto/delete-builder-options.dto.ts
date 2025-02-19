import { IsDefined, IsOptional } from 'class-validator';
import { BuilderFilterDto, BuilderRelationDto } from '@/common/utils/builder';

export class DeleteBuilderOptions<T> {
  @IsDefined()
  filter: BuilderFilterDto<T> | BuilderFilterDto<T>[];

  @IsOptional()
  relation?: BuilderRelationDto | BuilderRelationDto[];
}
