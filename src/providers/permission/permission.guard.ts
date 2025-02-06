import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '@/providers/permission/permission.decorator';
import { PermissionService } from '@/modules/permission/permission.service';
import { ParamsDto } from '@/modules/permission/dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _permissionService: PermissionService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const accessController = this._reflector.get(
      PERMISSION_KEY,
      ctx.getHandler(),
    );
    const params = this.getParams(ctx);

    return await this._permissionService.check(accessController, params);
  }

  private getParams(ctx: ExecutionContext): ParamsDto {
    const request = ctx.switchToHttp().getRequest();
    return Object.entries(
      Object.assign({ userId: request.user.id }, request.params),
    ).reduce((acc, [key, value]) => {
      acc[key] = Number(value);
      return acc;
    }, {}) as ParamsDto;
  }
}
