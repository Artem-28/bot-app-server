import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { BLOCK_TYPE_TABLE, BlockType } from '@/models/block-type';
import { BLOCK_TABLE } from '@/models/block';
import { SCRIPT_TABLE } from '@/models/script';

const table = hCreateTable(BLOCK_TABLE, [
  {
    name: 'script_id',
    isPrimary: true,
    type: 'int',
  },
  {
    name: 'type',
    type: 'enum',
    enum: [BlockType.FREE_TEXT, BlockType.BUTTON],
  },
  {
    name: 'x',
    type: 'int',
  },
  {
    name: 'y',
    type: 'int',
  },
  {
    name: 'prev_block_id',
    type: 'int',
    isNullable: true,
  },
  {
    name: 'next_block_id',
    type: 'int',
    isNullable: true,
  },
  {
    name: 'delay',
    type: 'int',
    default: 0,
  },
  {
    name: 'text',
    type: 'varchar',
    isNullable: true,
    default: null,
  },
]);

const foreignKeys = [
  new TableForeignKey({
    name: 'fk_block_script',
    columnNames: ['script_id'],
    referencedColumnNames: ['id'],
    referencedTableName: SCRIPT_TABLE,
    onDelete: 'CASCADE',
  }),
  new TableForeignKey({
    name: 'fk_block_type',
    columnNames: ['type'],
    referencedColumnNames: ['code'],
    referencedTableName: BLOCK_TYPE_TABLE,
    onDelete: 'CASCADE',
  }),
];

export class CreateBlockTable1752070965486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
    await queryRunner.createForeignKeys(table, foreignKeys);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropForeignKeys(table, foreignKeys);
    await queryRunner.dropTable(table);
  }
}
