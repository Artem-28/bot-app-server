import { BaseAggregate } from '@/models/base';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BlockType } from '@/models/block-type';
import { IBlock } from '@/models/block/block.interface';

export class BaseBlockAggregate
  extends BaseAggregate<IBlock>
  implements IBlock
{
  @IsDefined()
  @IsNumber()
  script_id: number;

  @IsDefined()
  @IsEnum(BlockType)
  type: BlockType;

  @IsNumber()
  @IsDefined()
  x: number;

  @IsNumber()
  @IsDefined()
  y: number;

  @IsNumber()
  @IsOptional()
  prev_block_id: number | null;

  @IsNumber()
  @IsOptional()
  next_block_id: number | null;

  @IsString()
  @IsOptional()
  text: string | null;

  @IsNumber()
  @IsOptional()
  delay = 0;

  static create(data: Partial<IBlock>) {
    const _entity = new BaseBlockAggregate();
    _entity.update(data);
    return _entity;
  }

  get instance(): IBlock {
    return {
      id: this.id,
      script_id: this.script_id,
      type: this.type,
      x: this.x,
      y: this.y,
      prev_block_id: this.prev_block_id,
      next_block_id: this.next_block_id,
      text: this.text,
      delay: this.delay,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
