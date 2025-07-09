import { IBaseEntity } from '@/models/base';
import { BlockType } from '@/models/block-type';

export interface IBlock extends IBaseEntity {
  script_id: number;
  type: BlockType;
  x: number;
  y: number;
  prev_block_id: number | null;
  next_block_id: number | null;
  text: string | null;
  delay: number;
}
