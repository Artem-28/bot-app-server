import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '@/repositories/permission';

@Injectable()
export class ResourceService {
  constructor(private readonly _permissionRepository: PermissionRepository) {}

  public async permissions() {
    return this._permissionRepository.getMany({
      filter: { field: 'parentCode', value: null },
      relation: { name: 'children', method: 'leftJoinAndSelect' },
    });
  }
}
