import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BlockType } from '@/models/block-type/block-type.interface';

export const BLOCK_TYPE_TABLE = 'block_types';

@Entity({ name: BLOCK_TYPE_TABLE })
export class BlockTypeEntity {
  @PrimaryColumn({
    name: 'code',
    type: 'enum',
    enum: BlockType,
    enumName: 'block_type',
    unique: true,
  })
  public code: BlockType;

  @Column()
  public title: string;
}
