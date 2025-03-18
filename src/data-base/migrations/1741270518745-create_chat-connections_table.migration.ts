import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { CHAT_CONNECTION_TABLE } from '@/models/chat-connections';

const table = hCreateTable(CHAT_CONNECTION_TABLE, [
  {
    name: 'key',
    type: 'varchar',
  },
  {
    name: 'project_id',
    type: 'int',
  },
  {
    name: 'script_id',
    type: 'int',
    isNullable: true,
    default: null,
  },
  {
    name: 'respondent_id',
    type: 'int',
    isNullable: true,
    default: null,
  },
  {
    name: 'user_id',
    type: 'int',
    isNullable: true,
    default: null,
  },
  {
    name: 'socket_id',
    type: 'varchar',
    isNullable: true,
    default: null,
  },
  {
    name: 'connected',
    type: 'boolean',
    default: false,
  },
]);
export class CreateChatConnectionsTable1741270518745
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
