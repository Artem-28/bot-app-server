import { Repository, SelectQueryBuilder } from 'typeorm';
import { IOrder, IPagination, MapObject } from '@/common/types';
import { hToArray } from '@/common/utils/formatter';
import {
  BuilderFilterDto,
  BuilderOptionsDto,
  BuilderRelationDto,
  BuilderRelationMethod,
} from '@/common/utils/database/dto';

export class HQueryBuilder<T> {
  private readonly _repository: Repository<T>;
  private readonly _alias: string;
  private _builder: SelectQueryBuilder<T>;
  private _whereFilter: QueryBuilderFilter<T> | null = null;
  private _andFilters: MapObject<QueryBuilderFilter<T>> = {};
  private _orFilters: MapObject<QueryBuilderFilter<T>> = {};
  private _relation: MapObject<QueryBuilderRelation> = {};
  private _orders: IOrder[] = [];
  private _pagination?: IPagination;

  constructor(repository: Repository<T>, options?: BuilderOptionsDto<T>) {
    const { alias, order, pagination, filter, relation } = options;
    this._repository = repository;
    this._alias = alias || 'entity';
    this.order(order);
    this.pagination(pagination);
    this.filter(filter);
    this.relation(relation);
  }

  get builder() {
    this._setupBuilder();
    return this._builder;
  }

  private _setupBuilder() {
    this._builder = this._repository.createQueryBuilder(this._alias);
    this._setupRelation();
    this._setupFilter();
    this._setupPagination();
    this._setupOrder();
  }

  private _setupRelation() {
    Object.values(this._relation).forEach((relation) =>
      relation.set(this._builder),
    );
  }

  private _setupOrder() {
    this._orders.forEach(({ sort, order, nulls }) => {
      this._builder.addOrderBy(sort, order, nulls);
    });
  }

  private _setupPagination() {
    if (!this._pagination) return;
    const { skip, take } = this._pagination;
    this._builder.take(take).skip(skip);
  }

  private _setupFilter() {
    if (!this._whereFilter) return;
    this._whereFilter.setWhere<T>(this._builder);
    Object.values(this._andFilters).forEach((f) => f.set(this._builder));
    Object.values(this._orFilters).forEach((f) => f.set(this._builder));
  }

  public order(order: IOrder | IOrder[]) {
    this._orders = hToArray(order);
  }

  public pagination(pagination: IPagination) {
    this._pagination = pagination;
  }

  public relation(relation: BuilderRelationDto | BuilderRelationDto[]) {
    hToArray(relation).forEach((dto) => {
      const r = new QueryBuilderRelation(dto, this._alias);
      this._relation[r.name] = r;
    });
  }

  public filter(filter: BuilderFilterDto<T> | BuilderFilterDto<T>[]) {
    hToArray(filter).forEach((dto) => {
      if (Array.isArray(dto.value) && !dto.value.length) return;
      const f = new QueryBuilderFilter(dto, this._alias);
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

export class QueryBuilderRelation {
  private readonly _relation: BuilderRelationDto;
  private readonly _alias: string;
  constructor(relation: BuilderRelationDto, alias: string) {
    this._relation = relation;
    this._alias = alias || '';
  }

  get name(): string {
    return this._alias
      ? `${this._alias}.${this._relation.name}`
      : this._relation.name;
  }

  private get _method(): BuilderRelationMethod {
    return this._relation.method || 'leftJoin';
  }

  private get _relationAlias(): string {
    return this._relation.alias || this._relation.name;
  }

  public set<T>(builder: SelectQueryBuilder<T>) {
    builder[this._method](this.name, this._relationAlias);
  }
}

export class QueryBuilderFilter<T> {
  private readonly _filter: BuilderFilterDto<T>;
  private readonly _alias: string;
  constructor(filter: BuilderFilterDto<T>, alias: string) {
    this._filter = filter;
    this._alias = alias || '';
  }

  get alias(): string {
    return this._filterAlias;
  }

  get field(): string {
    return `${this._filterAlias}${this._operator}${this._valueAlias}`;
  }

  get value(): MapObject<string> {
    if (this._filter.value === null) return {};
    const dataField = String(this._filter.field).split('.');
    const field = dataField[dataField.length - 1];
    return { [field]: this._filter.value };
  }

  private get _filterAlias(): string {
    let alias = this._alias;
    const dataField = String(this._filter.field).split('.');
    const field = dataField[dataField.length - 1];
    if (dataField.length > 1) {
      alias = dataField[dataField.length - 2];
    }
    return `${alias}.${field}`;
  }

  private get _valueAlias(): string {
    const dataField = String(this._filter.field).split('.');
    const field = dataField[dataField.length - 1];
    if (Array.isArray(this._filter.value)) return ` (:...${field})`;
    if (this._filter.value === null) return '';
    return ` :${field}`;
  }

  private get _operator(): string {
    if (Array.isArray(this._filter.value)) return ' IN';
    if (this._filter.value === null) return ' IS NULL';
    return ' =';
  }

  private _setOr<T>(builder: SelectQueryBuilder<T>) {
    if (this._filter.callback && typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.orWhere(this.field, this.value);
  }

  private _setAnd<T>(builder: SelectQueryBuilder<T>) {
    if (typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.andWhere(this.field, this.value);
  }

  public setWhere<T>(builder: SelectQueryBuilder<T>) {
    if (typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.where(this.field, this.value);
  }

  public set<T>(builder: SelectQueryBuilder<T>) {
    if (this._filter.operator === 'or') {
      this._setOr(builder);
      return;
    }
    this._setAnd(builder);
  }
}
