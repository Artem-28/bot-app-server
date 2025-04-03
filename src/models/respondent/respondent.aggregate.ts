import {
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseAggregate } from '@/models/base';
import { IRespondent } from '@/models/respondent/respondent.interface';
import { RespondentFingerprintAggregate } from '@/models/respondent-fingerprint';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  fingerprints: RespondentFingerprintAggregate[];

  static create(data: Partial<IRespondent>) {
    const _entity = new RespondentAggregate();
    _entity.update(data);
    return _entity;
  }

  update(data: Partial<IRespondent>) {
    const { fingerprints, ...params } = data;
    super.update(params);
    if (fingerprints) {
      this.fingerprints = [];

      fingerprints.forEach((print) => {
        if (!print.fingerprint) return;

        const fingerprint = RespondentFingerprintAggregate.create({
          fingerprint: print.fingerprint,
          projectId: this.projectId,
          respondentId: this.id,
        });

        this.fingerprints.push(fingerprint);
      });
    }
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
      fingerprints: this.fingerprints,
    };
  }
}
