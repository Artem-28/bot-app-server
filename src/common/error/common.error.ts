import { HttpException, HttpStatus } from '@nestjs/common';
import { hToArray } from '@/common/utils/formatter';
import { EntityPropertyNotFoundError, QueryFailedError } from 'typeorm';

export interface IError {
  field: string | null;
  ctx: 'app' | 'field';
  message: string;
}

export class CommonError extends Error {
  private readonly _status: HttpStatus | number = 500;
  private readonly _response: IError[] = [];

  constructor(error: IError | IError[], status?: number) {
    const errors = hToArray(error);
    super(JSON.stringify(errors));

    this._response = errors;
    this._status = status || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  getStatus() {
    return this._status;
  }

  getResponse() {
    return this._response;
  }
}

export const getExceptionErrors = (exception: any): IError[] => {
  const errors: IError[] = [];
  if (exception instanceof CommonError) {
    return exception.getResponse();
  }
  if (exception instanceof EntityPropertyNotFoundError) {
    errors.push({ ctx: 'app', field: null, message: exception.message });
    return errors;
  }
  if (exception instanceof QueryFailedError) {
    errors.push({ ctx: 'app', field: null, message: exception.message });
    return errors;
  }
  if (exception instanceof Error) {
    errors.push({ ctx: 'app', field: null, message: exception.message });
    return errors;
  }
  const response = exception.getResponse();

  if (!response) return errors;

  if (typeof response === 'string') {
    errors.push({ ctx: 'app', field: null, message: response });
    return errors;
  }
  errors.push({ ctx: 'app', field: null, message: JSON.stringify(response) });
  return errors;
};

export const getExceptionStatus = (exception: any): number => {
  if (exception instanceof CommonError) {
    return exception.getStatus();
  }
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
};
