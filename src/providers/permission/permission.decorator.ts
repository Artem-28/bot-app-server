import { AccessController } from '@/providers/permission/permission.type';
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export function Permission(accessController: AccessController) {
  return SetMetadata(PERMISSION_KEY, accessController);
}
