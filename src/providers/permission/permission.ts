import {
  AccessController,
  PermissionType,
} from '@/providers/permission/permission.type';

export const PROJECT_UPDATE: AccessController = {
  permissions: [PermissionType.OWNER],
  operator: 'or',
};

export const PROJECT_CHANGE_OWNER: AccessController = {
  permissions: [PermissionType.OWNER],
  operator: 'or',
};

export const PROJECT_INFO: AccessController = {
  permissions: [PermissionType.OWNER, PermissionType.SUBSCRIBER],
  operator: 'or',
};

export const SUBSCRIBER_CREATE: AccessController = {
  permissions: [PermissionType.OWNER],
  operator: 'or',
};
