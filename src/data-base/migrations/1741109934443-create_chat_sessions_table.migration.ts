import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { CHAT_SESSION_TABLE } from '@/models/chat-session';

const table = hCreateTable(CHAT_SESSION_TABLE, [
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
    name: 'key',
    type: 'varchar',
  },
  {
    name: 'title',
    type: 'varchar',
  },
  {
    name: 'last_active_at',
    type: 'timestamp',
  },
  {
    name: 'over_at',
    type: 'timestamp',
    isNullable: true,
  },
]);

export class CreateChatSessionsTable1741109934443
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
