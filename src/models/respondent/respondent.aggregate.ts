import {
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { BaseAggregate } from '@/models/base';
import { IRespondent } from '@/models/respondent/respondent.interface';
import { RespondentFingerprintAggregate } from '@/models/respondent-fingerprint';

export class RespondentAggregate
  extends BaseAggregate<IRespondent>
  implements IRespondent
{
  @IsDefined()
  @IsNumber()
  project_id: number;

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
    if (fingerprints) {
      this.fingerprints = [];

      fingerprints.forEach((print) => {
        if (!print.fingerprint) return;

        const fingerprint = RespondentFingerprintAggregate.create({
          fingerprint: print.fingerprint,
          project_id: this.project_id || params.project_id,
          respondent_id: this.id,
        });

        this.fingerprints.push(fingerprint);
      });
    }

    super.update(params);
  }

  get instance(): IRespondent {
    return {
      project_id: this.project_id,
      name: this.name,
      surname: this.surname,
      patronymic: this.patronymic,
      email: this.email,
      phone: this.phone,
      crated_at: this.crated_at,
      updated_at: this.updated_at,
      fingerprints: this.fingerprints,
    };
  }
}
