import { IBase } from '@/models/base/base.interface';
import { IsDate, IsNumber, IsOptional, validateSync } from 'class-validator';
import { DomainError } from '@/common/error';

export class BaseAggregate<T> implements IBase {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsDate()
  createdAt = new Date();

  @IsDate()
  updatedAt = new Date();

  public update(data: Partial<T>) {
    Object.entries(data).forEach(([key, value]) => {
      this[key] = value;
    });
    this.updatedAt = new Date();
    const errors = validateSync(this, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
  }
}
