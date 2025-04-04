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
      let parent_code = (accessPermission[inx] as PermissionEnum) || null;
      if (code === parent_code) parent_code = null;

      return PermissionAggregate.create({
        code,
        parent_code,
        title: `permissions.${code}`,
      }).instance;
    });

    const repository = dataSource.getRepository(PermissionEntity);
    await repository.save(resource);
  }
}
