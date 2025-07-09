import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';
import { BlockType } from '@/models/block-type';

export const BLOCK_TABLE = 'blocks';

@Entity({ name: BLOCK_TABLE })
export class BlockEntity extends BaseEntity {
  @Column({ name: 'script_id' })
  public script_id: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: BlockType,
    enumName: 'block_type',
  })
  public type: BlockType;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column({
    name: 'prev_block_id',
    nullable: true,
  })
  public prev_block_id: number | null;

  @Column({
    name: 'next_block_id',
    nullable: true,
  })
  public next_block_id: number | null;

  @Column({ nullable: true })
  public text: string | null;

  @Column({ default: 0 })
  public delay: number;
}
