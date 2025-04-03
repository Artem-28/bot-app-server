import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '@/repositories/base.repository';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { RespondentFingerprintRepositoryDomain } from '@/repositories/respondent-fingerprint';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';
import {
  IRespondentFingerprint,
  RespondentFingerprintAggregate,
  RespondentFingerprintEntity,
} from '@/models/respondent-fingerprint';

@Injectable()
export class RespondentFingerprintRepository
  extends BaseRepository
  implements RespondentFingerprintRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }

  async getOne(
    options?: BuilderOptionsDto<IRespondentFingerprint>,
  ): Promise<RespondentFingerprintAggregate | null> {
    const repository = this.getRepository(RespondentFingerprintEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return RespondentFingerprintAggregate.create(result);
  }
}
