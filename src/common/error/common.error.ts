import { HttpException, HttpStatus } from '@nestjs/common';
import { hToArray } from '@/common/utils/formatter';
import { TypeORMError } from 'typeorm';
import { errors } from '@/common/error/error-message.key';

export interface IException {
  target?: any;
  property?: string;
  messages: string[];
}

export interface IExceptionOptions {
  messages: string | string[];
  target?: any;
  property?: string;
}

export class CommonError extends Error {
  private readonly _status: HttpStatus | number = HttpStatus.BAD_REQUEST;
  private readonly _state: IException[] = [];
  private readonly _messages: string[];

  constructor(error: IExceptionOptions | IExceptionOptions[], status?: number) {
    const messages: string[] = [];
    const state: IException[] = [];
    hToArray(error).forEach((e) => {
      const _messages = hToArray(e.messages);

      const _error: IException = {
        target: e.target || 'app',
        messages: _messages,
      };

      if (e.property) {
        _error.property = e.property;
      }
      state.push(_error);
      messages.push(..._messages);
    });
    super(JSON.stringify(messages.join(',')));

    this._state = state;
    this._messages = messages;
    this._status = status || HttpStatus.BAD_REQUEST;
  }

  getStatus() {
    return this._status;
  }

  getResponse() {
    return {
      message: this._messages,
      errors: this._state,
    };
  }
}

export class ExceptionAggregate {
  private _state: IException[] = [];
  private _status: number = HttpStatus.BAD_REQUEST;
  private _messages: string[] = [];

  static create(error: any) {
    const exception = new ExceptionAggregate();
    exception.setStatus(error);

    if (error instanceof CommonError) {
      exception.setCommonError(error);
      return exception;
    }

    if (error instanceof TypeORMError) {
      exception.setTypeORMError(error);
      return exception;
    }

    if (error instanceof Error) {
      exception.setError(error);
      return exception;
    }

    exception.setUnknownError(error);
    return exception;
  }

  protected setCommonError(e: CommonError) {
    const response = e.getResponse();
    this._messages = response.message;
    this._state = response.errors;
    this._status = e.getStatus();
  }

  protected setTypeORMError(e: TypeORMError) {
    const messages = [e.message];
    this._messages = messages;
    this._state.push({ target: 'app', messages });
  }

  protected setError(e: Error) {
    const messages = [e.message];
    this._messages = messages;
    this._state.push({ target: 'app', messages });
  }

  protected setUnknownError(e: any) {
    if (!e) {
      const messages = [errors.unknown];
      this._messages = messages;
      this._state.push({ target: 'app', messages });
      return;
    }

    const response = e.getResponse();

    if (typeof response === 'string') {
      const messages = [response];
      this._messages = messages;
      this._state.push({ target: 'app', messages });
      return;
    }

    const messages = [JSON.stringify(response)];
    this._messages = messages;
    this._state.push({ target: 'app', messages });
  }

  protected setStatus(e) {
    if (e instanceof CommonError || e instanceof HttpException) {
      this._status = e.getStatus();
      return;
    }
    this._status = HttpStatus.BAD_REQUEST;
  }

  public getStatus() {
    return this._status;
  }

  public getResponse() {
    return {
      messages: this._messages,
      errors: this._state,
    };
  }
}
