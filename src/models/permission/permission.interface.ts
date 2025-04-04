import { PermissionEnum } from '@/providers/permission';

export interface IPermission {
  code: PermissionEnum;

  parent_code: PermissionEnum | null;

  title: string;

  children?: IPermission[];
}
