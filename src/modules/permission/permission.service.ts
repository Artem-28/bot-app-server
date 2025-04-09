import { Injectable } from '@nestjs/common';
import { UserPermissionRepository } from '@/repositories/user-permission';
import { UpdatePermissionDto } from '@/modules/permission/dto';
import { UserPermissionAggregate } from '@/models/user-permission';
import { CommonError, errors } from '@/common/error';
import { ParamSubscriber } from '@/common/param';

@Injectable()
export class PermissionService {
  constructor(
    private readonly _userPermissionRepository: UserPermissionRepository,
  ) {}

  public async update(param: ParamSubscriber, dto: UpdatePermissionDto) {
    let permissions: UserPermissionAggregate[] = [];

    const data = dto.permissions.map((code) =>
      UserPermissionAggregate.create({ ...param, code }),
    );

    const removed = await this._userPermissionRepository.remove({
      filter: [
        { field: 'project_id', value: param.project_id },
        { field: 'user_id', value: param.user_id, operator: 'and' },
      ],
    });

    if (!removed) {
      throw new CommonError({ messages: errors.permissions.update });
    }

    if (data.length) {
      permissions = await this._userPermissionRepository.save(data);
    }

    return {
      ...param,
      permissions: permissions.map((p) => p.code),
    };
  }

  public async list(param: ParamSubscriber) {
    const permissions = await this._userPermissionRepository.getMany({
      filter: [
        { field: 'project_id', value: param.project_id },
        { field: 'user_id', value: param.user_id },
      ],
    });
    return {
      ...param,
      permissions: permissions.map((p) => p.code),
    };
  }

  public async remove(param: ParamSubscriber) {
    return await this._userPermissionRepository.remove({
      filter: [
        { field: 'project_id', value: param.project_id },
        { field: 'user_id', value: param.user_id, operator: 'and' },
      ],
    });
  }

  public async removeProjectPermissions(projectId: number | string) {
    return await this._userPermissionRepository.remove({
      filter: { field: 'project_id', value: projectId },
    });
  }
}
