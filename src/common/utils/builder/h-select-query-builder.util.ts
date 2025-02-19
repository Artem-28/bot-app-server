import { HBaseQueryBuilder } from '@/common/utils/builder/h-base-query-builder.util';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BuilderOptionsDto } from '@/common/utils/builder/dto';
import { IOrder, IPagination } from '@/common/types';
import { hToArray } from '@/common/utils/formatter';

export class HSelectQueryBuilder<T> extends HBaseQueryBuilder<T> {
  protected _builder: SelectQueryBuilder<T>;
  private _orders: IOrder[] = [];
  private _pagination?: IPagination;

  constructor(repository: Repository<T>, options?: BuilderOptionsDto<T>) {
    super(repository);
    this._alias = options.alias || 'entity';

    this.order(options.order);
    this.pagination(options.pagination);
    this.filter(options.filter);
    this.relation(options.relation);
  }

  get builder() {
    this._builder = this._repository.createQueryBuilder(this._alias);
    this._setupRelation();
    this._setupFilter();
    this._setupPagination();
    this._setupOrder();
    return this._builder;
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

  public order(order: IOrder | IOrder[]) {
    this._orders = hToArray(order);
  }

  public pagination(pagination: IPagination) {
    this._pagination = pagination;
  }
}
