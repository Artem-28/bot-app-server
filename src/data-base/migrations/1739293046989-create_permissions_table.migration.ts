import {MigrationInterface, QueryRunner, TableForeignKey} from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { PERMISSION_TABLE } from '@/models/permission';
import { PermissionEnum } from '@/providers/permission';

const table = hCreateTable(
  PERMISSION_TABLE,
  [
    {
      name: 'code',
      isPrimary: true,
      isUnique: true,
      type: 'enum',
      enum: Object.values(PermissionEnum),
      enumName: 'permission_enum',
    },
    {
      name: 'parent_code',
      isNullable: true,
      type: 'enum',
      enum: Object.values(PermissionEnum),
      enumName: 'permission_enum',
    },
    {
      name: 'title',
      type: 'varchar',
    },
  ],
  {
    columnId: false,
    columnCreatedAt: false,
    columnUpdatedAt: false,
  },
);

const foreignKeys = [
  new TableForeignKey({
    name: 'fk_parent_permission',
    columnNames: ['parent_code'],
    referencedColumnNames: ['code'],
    referencedTableName: PERMISSION_TABLE,
    onDelete: 'CASCADE',
  }),
];

export class CreatePermissionsTable1739293046989 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(table, true);
    await queryRunner.createForeignKeys(table, foreignKeys);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(table, foreignKeys);
    await queryRunner.dropTable(table);
  }
}
