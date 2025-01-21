import { DataSource, EntityManager, Repository } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '@/common/interceptors';

export class BaseRepository {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _request: Request,
  ) {}

  protected getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager: EntityManager =
      (this._request && this._request[ENTITY_MANAGER_KEY]) ??
      this._dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}
