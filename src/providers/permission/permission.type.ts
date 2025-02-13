export enum PermissionPrivateEnum {
  OWNER = 'owner',
  SUBSCRIBER = 'subscriber',
}

export enum PermissionEnum {
  READ_PROJECT = 'read_project',
  WRITE_PROJECT = 'write_project',
  ACCESS_SCRIPT = 'access_script',
  READ_SCRIPT = 'read_script',
  WRITE_SCRIPT = 'write_script',
  REMOVE_SCRIPT = 'remove_script',
}

export const PermissionType = Object.assign(
  {},
  PermissionPrivateEnum,
  PermissionEnum,
);
export type AccessPermission = PermissionPrivateEnum | PermissionEnum;

export interface AccessController {
  permissions: AccessPermission[];
  operator: 'and' | 'or';
}
