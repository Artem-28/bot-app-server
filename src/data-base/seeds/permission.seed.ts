import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { PermissionAggregate, PermissionEntity } from '@/models/permission';
import { PermissionEnum } from '@/providers/permission';

export class PermissionSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
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
