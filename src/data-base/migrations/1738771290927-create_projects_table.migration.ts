import { MigrationInterface, QueryRunner } from 'typeorm';
import { PROJECT_TABLE } from '@/models/project';
import { hCreateTable } from '@/common/utils/database';

const table = hCreateTable(PROJECT_TABLE, [
  {
    name: 'owner_id',
    type: 'int',
  },
  {
    name: 'title',
    type: 'varchar',
  },
]);

export class CreateProjectsTable1738771290927 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
