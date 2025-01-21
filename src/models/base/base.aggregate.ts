import { IBase } from '@/models/base/base.interface';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class BaseAggregate implements IBase {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsDate()
  createdAt = new Date();

  @IsDate()
  updatedAt = new Date();
}
