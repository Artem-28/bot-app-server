import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { hCreateTable } from '@/common/utils/database';
import { PermissionEnum } from '@/providers/permission';
import { USER_PERMISSION_TABLE } from '@/models/user-permission/user-permission.entity';
import { PERMISSION_TABLE } from '@/models/permission';

const table = hCreateTable(
  USER_PERMISSION_TABLE,
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
    {
      name: 'code',
      isPrimary: true,
      type: 'enum',
      enum: Object.values(PermissionEnum),
      enumName: 'permission_enum',
    },
  ],
  {
    columnId: false,
    columnCreatedAt: false,
    columnUpdatedAt: false,
    uniques: [['user_id', 'project_id', 'code']],
  },
);

const foreignKeys = [
  new TableForeignKey({
    name: 'fk_user_permission',
    columnNames: ['code'],
    referencedColumnNames: ['code'],
    referencedTableName: PERMISSION_TABLE,
    onDelete: 'CASCADE',
  }),
];

export class CreateUserPermissionsTable1739468657854
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
