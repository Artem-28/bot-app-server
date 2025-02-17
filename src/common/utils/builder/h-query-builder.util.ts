import { Repository } from 'typeorm';
import { HSelectQueryBuilder } from '@/common/utils/builder/h-select-query-builder.util';
import {
  BuilderOptionsDto,
  DeleteBuilderOptions,
} from '@/common/utils/builder/dto';
import { HDeleteQueryBuilder } from '@/common/utils/builder/h-delete-query-builder.util';

export class HQueryBuilder {
  static select<T>(repository: Repository<T>, options?: BuilderOptionsDto<T>) {
    return new HSelectQueryBuilder<T>(repository, options);
  }

  static delete<T>(
    repository: Repository<T>,
    options?: DeleteBuilderOptions<T>,
  ) {
    return new HDeleteQueryBuilder(repository, options);
  }
}
