import { BuilderFilterDto } from '@/common/utils/builder/dto';
import { MapObject } from '@/common/types';
import { DeleteQueryBuilder, SelectQueryBuilder } from 'typeorm';

export class HQueryBuilderFilter<T> {
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
    if (this._filter.value === null || this._filter.value === 'IS NOT NULL') {
      return {};
    }
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
    return alias ? `${alias}.${field}` : field;
  }

  private get _valueAlias(): string {
    const dataField = String(this._filter.field).split('.');
    const field = dataField[dataField.length - 1];
    if (Array.isArray(this._filter.value)) return ` (:...${field})`;
    if (this._filter.value === null || this._filter.value === 'IS NOT NULL') {
      return '';
    }
    return ` :${field}`;
  }

  private get _operator(): string {
    if (Array.isArray(this._filter.value)) return ' IN';
    if (this._filter.value === null) return ' IS NULL';
    if (this._filter.value === 'IS NOT NULL') return ' IS NOT NULL';
    return ' =';
  }

  private _setOr<T>(builder: SelectQueryBuilder<T> | DeleteQueryBuilder<T>) {
    if (this._filter.callback && typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.orWhere(this.field, this.value);
  }

  private _setAnd<T>(builder: SelectQueryBuilder<T> | DeleteQueryBuilder<T>) {
    if (typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.andWhere(this.field, this.value);
  }

  public setWhere<T>(builder: SelectQueryBuilder<T> | DeleteQueryBuilder<T>) {
    if (typeof this._filter.callback === 'function') {
      builder.andWhere(this._filter.callback(this));
      return;
    }
    builder.where(this.field, this.value);
  }

  public set<T>(builder: SelectQueryBuilder<T> | DeleteQueryBuilder<T>) {
    if (this._filter.operator === 'or') {
      this._setOr(builder);
      return;
    }
    this._setAnd(builder);
  }
}
