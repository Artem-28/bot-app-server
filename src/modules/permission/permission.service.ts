import { Injectable } from '@nestjs/common';
import { UserPermissionRepository } from '@/repositories/user-permission';
import {
  GetPermissionDto,
  UpdatePermissionDto,
} from '@/modules/permission/dto';
import { UserPermissionAggregate } from '@/models/user-permission';
import { CommonError, errors } from '@/common/error';

@Injectable()
export class PermissionService {
  constructor(
    private readonly _userPermissionRepository: UserPermissionRepository,
  ) {}

  public async update(dto: UpdatePermissionDto) {
    let permissions: UserPermissionAggregate[] = [];

    const data = dto.permissions.map((code) =>
      UserPermissionAggregate.create({
        projectId: dto.projectId,
        userId: dto.userId,
        code,
      }),
    );

    const removed = await this._userPermissionRepository.remove({
      filter: [
        { field: 'projectId', value: dto.projectId },
        { field: 'userId', value: dto.userId, operator: 'and' },
      ],
    });

    if (!removed) {
      throw new CommonError({ messages: errors.permissions.update });
    }

    if (data.length) {
      permissions = await this._userPermissionRepository.save(data);
    }

    return {
      projectId: dto.projectId,
      userId: dto.userId,
      permissions: permissions.map((p) => p.code),
    };
  }

  public async list(dto: GetPermissionDto) {
    const permissions = await this._userPermissionRepository.getMany({
      filter: [
        { field: 'projectId', value: dto.projectId },
        { field: 'userId', value: dto.userId },
      ],
    });
    return {
      projectId: dto.projectId,
      userId: dto.userId,
      permissions: permissions.map((p) => p.code),
    };
  }

  public async remove(dto: UpdatePermissionDto) {
    return await this._userPermissionRepository.remove({
      filter: [
        { field: 'projectId', value: dto.projectId },
        { field: 'userId', value: dto.userId, operator: 'and' },
      ],
    });
  }

  public async removeProjectPermissions(projectId: number | string) {
    return await this._userPermissionRepository.remove({
      filter: { field: 'projectId', value: projectId },
    });
  }
}
