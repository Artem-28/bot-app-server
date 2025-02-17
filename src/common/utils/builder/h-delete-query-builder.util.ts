import { HBaseQueryBuilder } from '@/common/utils/builder/h-base-query-builder.util';
import { DeleteQueryBuilder, Repository } from 'typeorm';
import { DeleteBuilderOptions } from '@/common/utils/builder/dto';

export class HDeleteQueryBuilder<T> extends HBaseQueryBuilder<T> {
  protected _builder: DeleteQueryBuilder<T>;

  constructor(repository: Repository<T>, options?: DeleteBuilderOptions<T>) {
    super(repository);
    this.filter(options.filter);
    this.relation(options.relation);
  }

  get builder() {
    this._builder = this._repository.createQueryBuilder().delete();
    this._setupRelation();
    this._setupFilter();
    return this._builder;
  }
}
