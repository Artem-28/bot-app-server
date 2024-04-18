import { MigrationInterface, QueryRunner } from 'typeorm';
import { hCreateTable } from '@/common';

const TABLE_NAME = 'users';

export class CreateUserTable1713340260818 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = hCreateTable(TABLE_NAME, [
      {
        name: 'email',
        type: 'varchar',
        isUnique: true,
      },
      {
        name: 'password',
        type: 'varchar',
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
    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}