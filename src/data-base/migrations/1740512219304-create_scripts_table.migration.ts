import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { SCRIPT_TABLE } from '@/models/script';

const table = hCreateTable(SCRIPT_TABLE, [
  {
    name: 'project_id',
    type: 'int',
  },
  {
    name: 'title',
    type: 'varchar',
  },
]);

export class CreateScriptsTable1740512219304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
