import {
  BlockType,
  IBlockType,
} from '@/models/block-type/block-type.interface';
import { IsDefined, IsEnum, IsString, validateSync } from 'class-validator';
import { DomainError } from '@/common/error';

export class BlockTypeAggregate implements IBlockType {
  @IsDefined()
  @IsEnum(BlockType)
  code: BlockType;

  @IsDefined()
  @IsString()
  title: string;

  static create(data: IBlockType) {
    const _entity = new BlockTypeAggregate();
    Object.assign(_entity, data);

    const errors = validateSync(_entity, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }

    return _entity;
  }

  get instance(): IBlockType {
    return {
      code: this.code,
      title: this.title,
    };
  }
}
