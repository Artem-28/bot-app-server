import { MigrationInterface, QueryRunner } from 'typeorm';
import { USER_TABLE } from '@/models/user';
import { hCreateTable } from '@/common/utils/database';

const table = hCreateTable(USER_TABLE, [
  {
    name: 'email',
    type: 'varchar',
    isUnique: true,
  },
  {
    name: 'phone',
    type: 'varchar',
    isNullable: true,
  },
  {
    name: 'license_agreement',
    type: 'boolean',
    default: false,
  },
  {
    name: 'email_verified_at',
    type: 'timestamp',
    isNullable: true,
  },
  {
    name: 'phone_verified_at',
    type: 'timestamp',
    isNullable: true,
  },
  {
    name: 'last_active_at',
    type: 'timestamp',
    isNullable: true,
  },
]);

export class CreateUsersTable1737472622553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
