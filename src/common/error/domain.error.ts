import { CommonError, IExceptionOptions } from '@/common/error/common.error';
import { ValidationError as ErrorClassValidator } from 'class-validator';
import { ValidationError } from '@nestjs/common';
import { hCamelToSnake } from '@/common/utils/formatter';

export class DomainError extends CommonError {
  constructor(errors: ErrorClassValidator[] | ValidationError[]) {
    const _errors: IExceptionOptions[] = [];

    errors.forEach((e) => {
      const messages: string[] = [];
      const constraints = e.constraints || {};
      Object.entries(constraints).forEach((v) => {
        const key = hCamelToSnake(v[0]);
        messages.push(`errors.validators.${key}`);
      });
      _errors.push({
        target: e.target,
        property: e.property,
        messages,
      });
    });
    console.log('ERRORS', _errors);
    super(_errors);
    this.name = DomainError.name;
  }
}
