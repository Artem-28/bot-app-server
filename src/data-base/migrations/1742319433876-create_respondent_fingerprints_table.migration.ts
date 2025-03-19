import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { RESPONDENT_FINGERPRINT_TABLE } from '@/models/respondent-fingerprint';
import { FINGERPRINT_TABLE } from '@/models/fingerprint';
import { RESPONDENT_TABLE } from '@/models/respondent';

const table = hCreateTable(
  RESPONDENT_FINGERPRINT_TABLE,
  [
    {
      name: 'respondent_id',
      type: 'int',
      isPrimary: true,
    },
    {
      name: 'fingerprint',
      type: 'varchar',
      isPrimary: true,
    },
    {
      name: 'project_id',
      type: 'int',
    },
  ],
  {
    columnId: false,
    columnUpdatedAt: false,
    columnCreatedAt: false,
  },
);

const foreignKeys = [
  new TableForeignKey({
    name: 'fk_respondent_fingerprint',
    columnNames: ['fingerprint'],
    referencedColumnNames: ['fingerprint'],
    referencedTableName: FINGERPRINT_TABLE,
    onDelete: 'CASCADE',
  }),
  new TableForeignKey({
    name: 'fk_respondent',
    columnNames: ['respondent_id'],
    referencedColumnNames: ['id'],
    referencedTableName: RESPONDENT_TABLE,
    onDelete: 'CASCADE',
  }),
];

export class CreateRespondentFingerprintsTable1742319433876
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
