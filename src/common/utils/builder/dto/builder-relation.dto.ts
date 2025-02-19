import { IsDefined, IsOptional, IsString } from 'class-validator';

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
