import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { BaseAggregate } from '@/models/base';
import { IRespondent } from '@/models/respondent/respondent.interface';

export class RespondentAggregate
  extends BaseAggregate<IRespondent>
  implements IRespondent
{
  @IsDefined()
  @IsNumber()
  projectId: number;

  @IsString()
  @IsOptional()
  name = null;

  @IsString()
  @IsOptional()
  surname = null;

  @IsString()
  @IsOptional()
  patronymic = null;

  @IsEmail()
  @IsOptional()
  email = null;

  @IsString()
  @IsOptional()
  phone = null;

  static create(data: Partial<IRespondent>) {
    const _entity = new RespondentAggregate();
    Object.assign(_entity, data);
    _entity.createdAt = data?.id ? _entity.createdAt : new Date();
    const errors = validateSync(_entity, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return _entity;
  }

  get instance(): IRespondent {
    return {
      projectId: this.projectId,
      name: this.name,
      surname: this.surname,
      patronymic: this.patronymic,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
