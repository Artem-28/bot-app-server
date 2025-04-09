import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { SUBSCRIBER_TABLE } from '@/models/subscriber';

const table = hCreateTable(
  SUBSCRIBER_TABLE,
  [
    {
      name: 'user_id',
      isPrimary: true,
      type: 'int',
    },
    {
      name: 'project_id',
      isPrimary: true,
      type: 'int',
    },
  ],
  {
    uniques: [['user_id', 'project_id']],
    columnId: false,
    columnUpdatedAt: false,
  },
);

export class CreateSubscribersTable1738842732617 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
