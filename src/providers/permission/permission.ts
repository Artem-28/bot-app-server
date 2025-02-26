import {
  AccessController,
  PermissionType,
} from '@/providers/permission/permission.type';

export const PROJECT_UPDATE: AccessController = {
  permissions: [PermissionType.OWNER, PermissionType.WRITE_PROJECT],
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
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_SUBSCRIBER,
    PermissionType.CREATE_SUBSCRIBER,
  ],
  operator: 'or',
};

export const SUBSCRIBER_VIEW: AccessController = {
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_SUBSCRIBER,
    PermissionType.READ_SUBSCRIBER,
  ],
  operator: 'or',
};

export const SUBSCRIBER_REMOVE: AccessController = {
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_SUBSCRIBER,
    PermissionType.REMOVE_SUBSCRIBER,
  ],
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

export const SCRIPT_CREATE: AccessController = {
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_SCRIPT,
    PermissionType.WRITE_SCRIPT,
  ],
  operator: 'or',
};

export const SCRIPT_UPDATE: AccessController = {
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_SCRIPT,
    PermissionType.WRITE_SCRIPT,
  ],
  operator: 'or',
};

export const SCRIPT_VIEW: AccessController = {
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_SCRIPT,
    PermissionType.READ_SCRIPT,
  ],
  operator: 'or',
};

export const SCRIPT_REMOVE: AccessController = {
  permissions: [
    PermissionType.OWNER,
    PermissionType.ACCESS_SCRIPT,
    PermissionType.REMOVE_SCRIPT,
  ],
  operator: 'or',
};

