import { MigrationInterface, QueryRunner } from 'typeorm';
import { CONFIRM_CODE_TABLE, ConfirmCodeTypeEnum } from '@/models/confirm-code';
import { hCreateTable } from '@/common/utils/database';

const table = hCreateTable(CONFIRM_CODE_TABLE, [
  {
    name: 'value',
    type: 'varchar',
  },
  {
    name: 'type',
    type: 'enum',
    enum: [
      ConfirmCodeTypeEnum.REGISTRATION,
      ConfirmCodeTypeEnum.UPDATE_PASSWORD,
    ],
  },
  {
    name: 'destination',
    type: 'varchar',
  },
  {
    name: 'live_at',
    type: 'timestamp',
  },
  {
    name: 'delay_at',
    type: 'timestamp',
  },
]);

export class CreateConfirmCodeTable1737727305691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
