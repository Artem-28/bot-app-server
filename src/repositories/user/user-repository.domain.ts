import { IUser, UserAggregate } from '@/models/user';
import { BuilderOptionsDto } from '@/common/utils/builder';

export abstract class UserRepositoryDomain {
  abstract create(user: IUser): Promise<UserAggregate>;
  abstract getOne(
    options?: BuilderOptionsDto<IUser>,
  ): Promise<UserAggregate | null>;
}
