import {
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @IsOptional()
  @IsString()
  fingerprintKey: string | null;

  static create(data: Partial<IRespondent>) {
    const _entity = new RespondentAggregate();
    _entity.update(data);
    return _entity;
  }

  get instance(): IRespondent {
    return {
      projectId: this.projectId,
      fingerprintKey: this.fingerprintKey,
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
