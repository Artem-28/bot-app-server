import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { BLOCK_TYPE_TABLE } from '@/models/block-type/block-type.entity';
import { BlockType } from '@/models/block-type';

const table = hCreateTable(
  BLOCK_TYPE_TABLE,
  [
    {
      name: 'code',
      type: 'enum',
      isPrimary: true,
      enum: [BlockType.FREE_TEXT, BlockType.BUTTON],
    },
    {
      name: 'title',
      type: 'varchar',
    },
  ],
  {
    columnId: false,
    columnCreatedAt: false,
    columnUpdatedAt: false,
  },
);

export class CreateBlockTypeTable1752063980898 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
