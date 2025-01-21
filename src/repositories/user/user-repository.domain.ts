import { IUser, UserAggregate } from '@/models/user';
import { FilterDto } from '@/common/dto';

export abstract class UserRepositoryDomain {
  abstract create(user: IUser): Promise<UserAggregate>;
  abstract getOne(
    filter: FilterDto<IUser> | FilterDto<IUser>[],
  ): Promise<UserAggregate | null>;
}
