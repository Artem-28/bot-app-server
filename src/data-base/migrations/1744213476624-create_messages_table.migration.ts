import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { AuthorMessageType, MESSAGE_TABLE } from '@/models/message';
import { MESSAGE_SESSION_TABLE } from '@/models/message-session';

const table = hCreateTable(MESSAGE_TABLE, [
  {
    name: 'session_id',
    isPrimary: true,
    type: 'int',
  },
  {
    name: 'operator_id',
    isNullable: true,
    type: 'int',
  },
  {
    name: 'author_type',
    type: 'enum',
    enum: [
      AuthorMessageType.OPERATOR,
      AuthorMessageType.RESPONDENT,
      AuthorMessageType.SYSTEM,
    ],
  },
  {
    name: 'text',
    isNullable: true,
    default: null,
    type: 'varchar',
  },
]);

const foreignKeys = [
  new TableForeignKey({
    name: 'fk_message_session',
    columnNames: ['session_id'],
    referencedColumnNames: ['id'],
    referencedTableName: MESSAGE_SESSION_TABLE,
    onDelete: 'CASCADE',
  }),
];

export class CreateMessagesTable1744213476624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
    await queryRunner.createForeignKeys(table, foreignKeys);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(table, foreignKeys);
    await queryRunner.dropTable(table);
  }
}
