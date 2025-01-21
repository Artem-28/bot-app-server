import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { AUTH_DATA_TABLE } from '@/models/auth-data';

const table = hCreateTable(AUTH_DATA_TABLE, [
  {
    name: 'login',
    type: 'varchar',
    isUnique: true,
  },
  {
    name: 'password',
    type: 'varchar',
  },
]);

export class CreateAuthDataTable1737392448870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
