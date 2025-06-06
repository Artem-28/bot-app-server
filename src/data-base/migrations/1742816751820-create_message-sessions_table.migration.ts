import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { MESSAGE_SESSION_TABLE, SessionMode } from '@/models/message-session';
import { RESPONDENT_TABLE } from '@/models/respondent';

const table = hCreateTable(
  MESSAGE_SESSION_TABLE,
  [
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
      name: 'mode',
      type: 'enum',
      enum: [SessionMode.OPERATOR, SessionMode.SYSTEM],
    },
    {
      name: 'close_at',
      type: 'timestamp',
      isNullable: true,
    },
    {
      name: 'last_active_at',
      type: 'timestamp',
      isNullable: true,
    },
  ],
  { columnUpdatedAt: false },
);

const foreignKeys = [
  new TableForeignKey({
    name: 'fk_respondent_message_session',
    columnNames: ['respondent_id'],
    referencedColumnNames: ['id'],
    referencedTableName: RESPONDENT_TABLE,
    onDelete: 'CASCADE',
  }),
];

export class CreateMessageSessionsTable1742816751820
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
    await queryRunner.createForeignKeys(table, foreignKeys);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(table, foreignKeys);
    await queryRunner.dropTable(table);
  }
}
