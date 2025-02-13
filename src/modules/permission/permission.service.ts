import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '@/repositories/permission';

@Injectable()
export class PermissionService {
  constructor(private readonly _permissionRepository: PermissionRepository) {}

  public async list() {
    return this._permissionRepository.getMany({
      filter: { field: 'parentCode', value: null },
      relation: { name: 'children', method: 'leftJoinAndSelect' },
    });
  }
}
