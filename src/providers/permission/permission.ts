import {
  AccessController,
  PermissionType,
} from '@/providers/permission/permission.type';

export const PROJECT_VIEW: AccessController = {
  permissions: [PermissionType.OWNER, PermissionType.SUBSCRIBER],
  operator: 'or',
};

export const SUBSCRIBER_CREATE: AccessController = {
  permissions: [PermissionType.OWNER],
  operator: 'or',
};
