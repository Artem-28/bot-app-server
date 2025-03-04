import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { RESPONDENT_TABLE } from '@/models/respondent';

const table = hCreateTable(RESPONDENT_TABLE, [
  {
    name: 'project_id',
    type: 'int',
  },
  {
    name: 'name',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'surname',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'patronymic',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'email',
    type: 'varchar',
    isNullable: true,
    isUnique: true,
  },
  {
    name: 'phone',
    type: 'varchar',
    isNullable: true,
    isUnique: true,
  },
]);

export class CreateRespondentsTable1740588736134 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
