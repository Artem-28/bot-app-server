import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { MESSAGE_SESSION_TABLE } from '@/models/message-session';

const table = hCreateTable(MESSAGE_SESSION_TABLE, [
  {
    name: 'project_id',
    type: 'int',
  },
  {
    name: 'script_id',
    type: 'int',
  },
  {
    name: 'respondent_id',
    type: 'int',
  },
  {
    name: 'title',
    type: 'varchar',
  },
  {
    name: 'end_at',
    type: 'timestamp',
    isNullable: true,
  },
]);

export class CreateMessageSessionsTable1742816751820
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
