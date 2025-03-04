export enum PermissionPrivateEnum {
  OWNER = 'owner',
}

export enum PermissionEnum {
  WRITE_PROJECT = 'write_project',
  ACCESS_SCRIPT = 'access_script',
  READ_SCRIPT = 'read_script',
  WRITE_SCRIPT = 'write_script',
  REMOVE_SCRIPT = 'remove_script',
  ACCESS_PERMISSION = 'access_permission',
  READ_PERMISSION = 'read_permission',
  WRITE_PERMISSION = 'write_permission',
  ACCESS_SUBSCRIBER = 'access_subscriber',
  CREATE_SUBSCRIBER = 'create_subscriber',
  REMOVE_SUBSCRIBER = 'remove_subscriber',
  READ_SUBSCRIBER = 'read_subscriber',
  ACCESS_RESPONDENT = 'access_respondent',
  READ_RESPONDENT = 'read_respondent',
  WRITE_RESPONDENT = 'write_respondent',
  REMOVE_RESPONDENT = 'remove_respondent',
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
