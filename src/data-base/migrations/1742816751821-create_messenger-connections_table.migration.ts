import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { MESSENGER_CONNECTION_TABLE } from '@/models/messenger-connection';

const table = hCreateTable(MESSENGER_CONNECTION_TABLE, [
  {
    name: 'client_id',
    type: 'varchar',
  },
  {
    name: 'project_id',
    type: 'int',
  },
  {
    name: 'session_id',
    type: 'int',
    isNullable: true,
    default: null,
  },
  {
    name: 'operator_id',
    type: 'int',
    isNullable: true,
    default: null,
  },
]);

export class CreateMessengerConnectionsTable1742816751821
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
