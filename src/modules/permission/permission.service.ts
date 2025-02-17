import { Injectable } from '@nestjs/common';
import { UserPermissionRepository } from '@/repositories/user-permission';
import { updatePermissionDto } from '@/modules/permission/dto';
import { UserPermissionAggregate } from '@/models/user-permission';
import { CommonError, errors } from '@/common/error';

@Injectable()
export class PermissionService {
  constructor(
    private readonly _userPermissionRepository: UserPermissionRepository,
  ) {}

  public async update(dto: updatePermissionDto) {
    const data = dto.permissions.map((code) =>
      UserPermissionAggregate.create({
        projectId: dto.projectId,
        userId: dto.userId,
        code,
      }),
    );

    const removed = await this._userPermissionRepository.remove([
      { field: 'projectId', value: dto.projectId },
      { field: 'userId', value: dto.userId, operator: 'and' },
    ]);

    if (!removed) {
      throw new CommonError({ messages: errors.permissions.update });
    }
    const permissions = await this._userPermissionRepository.save(data);
    return permissions;
  }
}
