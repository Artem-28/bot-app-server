import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { FINGERPRINT_GROUP_TABLE } from '@/models/fingerprint-group';

const table = hCreateTable(
  FINGERPRINT_GROUP_TABLE,
  [
    {
      name: 'key',
      type: 'varchar',
      isUnique: true,
      isPrimary: true,
    },
  ],
  {
    columnId: false,
    columnUpdatedAt: false,
    columnCreatedAt: false,
  },
);

export class CreateFingerprintGroupsTable1740588736132
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
