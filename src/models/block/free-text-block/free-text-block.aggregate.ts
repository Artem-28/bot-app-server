import { BaseBlockAggregate } from '@/models/block/base-block';
import { IsDefined } from 'class-validator';

export class FreeTextBlockAggregate extends BaseBlockAggregate {
  @IsDefined()
  text: string;
}
