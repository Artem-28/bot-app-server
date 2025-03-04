export interface MapObject<T> {
  [key: string]: T;
}

export interface IOrder {
  sort: string;
  order?: 'ASC' | 'DESC';
  nulls?: 'NULLS FIRST' | 'NULLS LAST';
}

export interface IPagination {
  skip?: number;
  take?: number;
}

export interface IToken {
  accessToken: string | null;
  tokenType: 'Bearer' | null;
}

export interface IProjectParam {
  projectId: string;
}

export interface IScriptParam extends IProjectParam {
  scriptId: string;
}

export interface IRespondentParam extends IProjectParam {
  respondentId: string;
}
