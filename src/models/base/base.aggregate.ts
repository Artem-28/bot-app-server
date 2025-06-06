import { IsDate, IsNumber, IsOptional, validateSync } from 'class-validator';
import { IBaseEntity} from '@/models/base/base.interface';
import { DomainError } from '@/common/error';

export class BaseAggregate<T> implements IBaseEntity {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsDate()
  created_at = new Date();

  @IsDate()
  updated_at = new Date();

  public update(data: Partial<T>) {
    const entries = Object.entries(data);
    if (entries.length === 0) return;

    entries.forEach(([key, value]) => {
      this[key] = value;
    });
    this.updated_at = new Date();
    this.created_at = this.id ? this.created_at : new Date();

    const errors = validateSync(this, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
  }
}
