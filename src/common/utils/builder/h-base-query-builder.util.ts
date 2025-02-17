import { DeleteQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { MapObject } from '@/common/types';
import { HQueryBuilderFilter } from '@/common/utils/builder/h-query-builder-filter.util';
import { HQueryBuilderRelation } from '@/common/utils/builder/h-query-builder-relation.util';
import {
  BuilderFilterDto,
  BuilderRelationDto,
} from '@/common/utils/builder/dto';
import { hToArray } from '@/common/utils/formatter';

export class HBaseQueryBuilder<T> {
  protected _repository: Repository<T>;
  protected _alias: string | null = null;
  protected _builder: DeleteQueryBuilder<T> | SelectQueryBuilder<T>;
  private _whereFilter: HQueryBuilderFilter<T> | null = null;
  private _andFilters: MapObject<HQueryBuilderFilter<T>> = {};
  private _orFilters: MapObject<HQueryBuilderFilter<T>> = {};
  private _relation: MapObject<HQueryBuilderRelation> = {};

  constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  protected _setupRelation() {
    Object.values(this._relation).forEach((relation) =>
      relation.set(this._builder),
    );
  }

  protected _setupFilter() {
    if (!this._whereFilter) return;
    this._whereFilter.setWhere<T>(this._builder);
    Object.values(this._andFilters).forEach((f) => f.set(this._builder));
    Object.values(this._orFilters).forEach((f) => f.set(this._builder));
  }

  public relation(relation: BuilderRelationDto | BuilderRelationDto[]) {
    hToArray(relation).forEach((dto) => {
      const r = new HQueryBuilderRelation(dto, this._alias);
      this._relation[r.name] = r;
    });
  }

  public filter(filter: BuilderFilterDto<T> | BuilderFilterDto<T>[]) {
    hToArray(filter).forEach((dto) => {
      if (Array.isArray(dto.value) && !dto.value.length) return;
      const f = new HQueryBuilderFilter(dto, this._alias);
      if (!this._whereFilter) {
        this._whereFilter = f;
        return;
      }
      if (dto.operator === 'or') {
        this._orFilters[f.alias] = f;
        return;
      }
      this._andFilters[f.alias] = f;
    });
  }
}
