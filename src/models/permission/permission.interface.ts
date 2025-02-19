import { PermissionEnum } from '@/providers/permission';

export interface IPermission {
  code: PermissionEnum;

  parentCode: PermissionEnum | null;

  title: string;

  children?: IPermission[];
}
