import {
  AccessController,
  PermissionEnum,
  PermissionType,
} from '@/providers/permission/permission.type';

export const PROJECT_UPDATE: AccessController = {
  permissions: [PermissionType.OWNER, PermissionEnum.WRITE_PROJECT],
  operator: 'or',
};

export const PROJECT_CHANGE_OWNER: AccessController = {
  permissions: [PermissionType.OWNER],
  operator: 'or',
};

export const PROJECT_INFO: AccessController = {
  permissions: [PermissionType.OWNER],
  operator: 'or',
};

export const PROJECT_REMOVE: AccessController = {
  permissions: [PermissionType.OWNER],
  operator: 'or',
};

export const SUBSCRIBER_CREATE: AccessController = {
  permissions: [PermissionType.OWNER],
  operator: 'or',
};

export const PERMISSION_UPDATE: AccessController = {
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_PERMISSION,
    PermissionType.WRITE_PERMISSION,
  ],
  operator: 'or',
};

export const PERMISSION_LIST: AccessController = {
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_PERMISSION,
    PermissionType.READ_PERMISSION,
  ],
  operator: 'or',
};
