import { IBaseEntity } from '@/models/base';

export enum AuthorMessageType {
  RESPONDENT = 'respondent',
  OPERATOR = 'operator',
  SYSTEM = 'system',
}

export interface IMessage extends IBaseEntity {
  session_id: number;

  author_type: AuthorMessageType;

  operator_id: number | null;

  text: string | null;
}
