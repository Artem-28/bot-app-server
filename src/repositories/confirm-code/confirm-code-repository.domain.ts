import { ConfirmCodeAggregate, IConfirmCode } from '@/models/confirm-code';
import { BuilderOptionsDto } from '@/common/utils/builder';

export abstract class ConfirmCodeRepositoryDomain {
  abstract create(code: IConfirmCode): Promise<ConfirmCodeAggregate>;
  abstract update(id: number, data: Partial<IConfirmCode>): Promise<boolean>;
  abstract getOne(
    options?: BuilderOptionsDto<IConfirmCode>,
  ): Promise<ConfirmCodeAggregate | null>;
  abstract remove(id: number): Promise<boolean>;
}
