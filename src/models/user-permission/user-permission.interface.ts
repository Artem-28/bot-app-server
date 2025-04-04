import { PermissionEnum } from '@/providers/permission';

export interface IUserPermission {
  user_id: number;
  project_id: number;
  code: PermissionEnum;
}
