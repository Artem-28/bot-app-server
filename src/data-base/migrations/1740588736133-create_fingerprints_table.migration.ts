import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { FINGERPRINT_TABLE } from '@/models/fingerprint';
import { FINGERPRINT_GROUP_TABLE } from '@/models/fingerprint-group';

const table = hCreateTable(
  FINGERPRINT_TABLE,
  [
    {
      name: 'fingerprint',
      type: 'varchar',
      isUnique: true,
      isPrimary: true,
    },
    {
      name: 'group_key',
      type: 'varchar',
    },
    {
      name: 'last_active_at',
      type: 'timestamp',
    },
  ],
  {
    columnId: false,
    columnUpdatedAt: false,
  },
);

const foreignKeys = [
  new TableForeignKey({
    name: 'fk_fingerprint_groups',
    columnNames: ['group_key'],
    referencedColumnNames: ['key'],
    referencedTableName: FINGERPRINT_GROUP_TABLE,
    onDelete: 'CASCADE',
  }),
];

export class CreateFingerprintsTable1740588736133
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
