import { IBlock } from '@/models/block/block.interface';
import { BlockType } from '@/models/block-type';
import { FreeTextBlockAggregate } from '@/models/block/free-text-block';
import { ButtonBlockAggregate } from '@/models/block/button-block';

export class BlockAggregate {
  static create(data: Partial<IBlock>) {
    switch (data.type) {
      case BlockType.FREE_TEXT:
        return FreeTextBlockAggregate.create(data);
      case BlockType.BUTTON:
        return ButtonBlockAggregate.create(data);
    }
  }
}
