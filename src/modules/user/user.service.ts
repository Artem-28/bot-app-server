import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/repositories/user';
import { CreateUserDto } from '@/modules/user/dto';
import { CommonError } from '@/common/error';
import { IUser, UserAggregate } from '@/models/user';
import { FilterDto } from '@/common/dto';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  public async create(dto: CreateUserDto): Promise<UserAggregate> {
    if (!dto.licenseAgreement) {
      throw new CommonError({
        field: 'licenseAgreement',
        ctx: 'field',
        message: 'errors.registration.licenseAgreement',
      });
    }

    const userAggregate = UserAggregate.create(dto);
    userAggregate.verifyEmail();

    return await this._userRepository.create(userAggregate.instance);
  }

  public async getOne(
    filter: FilterDto<IUser>,
    throwException = false,
  ): Promise<UserAggregate | null> {
    const user = await this._userRepository.getOne(filter);
    if (!user && throwException) {
      throw new CommonError(
        {
          field: null,
          ctx: 'app',
          message: 'errors.user.not_found',
        },
        400,
      );
    }

    return user;
  }
}
