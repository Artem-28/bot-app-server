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
        project_id: dto.project_id,
        user_id: dto.user_id,
        code,
      }),
    );

    const removed = await this._userPermissionRepository.remove({
      filter: [
        { field: 'project_id', value: dto.project_id },
        { field: 'user_id', value: dto.user_id, operator: 'and' },
      ],
    });

    if (!removed) {
      throw new CommonError({ messages: errors.permissions.update });
    }

    if (data.length) {
      permissions = await this._userPermissionRepository.save(data);
    }

    return {
      projectId: dto.project_id,
      userId: dto.user_id,
      permissions: permissions.map((p) => p.code),
    };
  }

  public async list(dto: GetPermissionDto) {
    const permissions = await this._userPermissionRepository.getMany({
      filter: [
        { field: 'project_id', value: dto.project_id },
        { field: 'user_id', value: dto.user_id },
      ],
    });
    return {
      projectId: dto.project_id,
      userId: dto.user_id,
      permissions: permissions.map((p) => p.code),
    };
  }

  public async remove(dto: UpdatePermissionDto) {
    return await this._userPermissionRepository.remove({
      filter: [
        { field: 'project_id', value: dto.project_id },
        { field: 'user_id', value: dto.user_id, operator: 'and' },
      ],
    });
  }

  public async removeProjectPermissions(projectId: number | string) {
    return await this._userPermissionRepository.remove({
      filter: { field: 'project_id', value: projectId },
    });
  }
}
