export enum PermissionPrivateEnum {
  OWNER = 'owner',
  SUBSCRIBER = 'subscriber',
}

export enum PermissionEnum {}

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
