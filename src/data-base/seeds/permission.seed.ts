import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {
  PERMISSION_TABLE,
  PermissionAggregate,
  PermissionEntity,
} from '@/models/permission';
import { PermissionEnum } from '@/providers/permission';

export class PermissionSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    // const queryRunner = dataSource.createQueryRunner();
    // await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`); // Disable FK checks
    // await queryRunner.query(`TRUNCATE TABLE ${PERMISSION_TABLE};`);
    // await queryRunner.query(
    //   `ALTER TABLE ${PERMISSION_TABLE} AUTO_INCREMENT = 1;`,
    // ); // Reset auto-increment
    // await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`); // Re-enable FK checks

    const accessPermission = Object.values(PermissionEnum).filter((code) =>
      code.includes('access'),
    ) as string[];

    const resource = Object.keys(PermissionEnum).map((key) => {
      const code = PermissionEnum[key];
      const value = code.split('_')[1];
      const inx = accessPermission.indexOf(`access_${value}`);
      let parentCode = (accessPermission[inx] as PermissionEnum) || null;
      if (code === parentCode) parentCode = null;

      return PermissionAggregate.create({
        code,
        parentCode,
        title: `permissions.${code}`,
      }).instance;
    });

    const repository = dataSource.getRepository(PermissionEntity);
    await repository.save(resource);
  }
}
