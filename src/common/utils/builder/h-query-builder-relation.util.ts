import {
  BuilderRelationDto,
  BuilderRelationMethod,
} from '@/common/utils/builder/dto';
import { DeleteQueryBuilder, SelectQueryBuilder } from 'typeorm';

export class HQueryBuilderRelation {
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

  public set<T>(builder: SelectQueryBuilder<T> | DeleteQueryBuilder<T>) {
    builder[this._method](this.name, this._relationAlias);
  }
}
