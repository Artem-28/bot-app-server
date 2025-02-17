import { PermissionEnum } from '@/providers/permission';

export interface IUserPermission {
  userId: number;
  projectId: number;
  code: PermissionEnum;
}
