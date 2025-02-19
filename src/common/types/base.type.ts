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