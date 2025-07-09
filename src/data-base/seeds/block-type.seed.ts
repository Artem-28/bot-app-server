import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {
  BlockType,
  BlockTypeAggregate,
  BlockTypeEntity,
} from '@/models/block-type';

export class BlockTypeSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const resource = Object.keys(BlockType).map((key) => {
      const code = BlockType[key];
      const title = `block.types.${code}`;

      return BlockTypeAggregate.create({ code, title }).instance;
    });

    const repository = dataSource.getRepository(BlockTypeEntity);
    await repository.save(resource);
  }
}
