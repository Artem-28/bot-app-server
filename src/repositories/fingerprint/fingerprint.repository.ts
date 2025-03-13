import { BaseRepository } from '@/repositories/base.repository';
import { FingerprintRepositoryDomain } from '@/repositories/fingerprint/fingerprint-repository.domain';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import {
  FingerprintGroupEntity,
  IFingerprintGroup,
} from '@/models/fingerprint-group';
import { FingerprintGroupAggregate } from '@/models/fingerprint-group/fingerprint-group.aggregate';
import {
  FingerprintAggregate,
  FingerprintEntity,
  IFingerprint,
} from '@/models/fingerprint';
import { BuilderOptionsDto, HQueryBuilder } from '@/common/utils/builder';

@Injectable()
export class FingerprintRepository
  extends BaseRepository
  implements FingerprintRepositoryDomain
{
  constructor(dataSource: DataSource, @Inject(REQUEST) request?: Request) {
    super(dataSource, request);
  }

  async createOrUpdateFingerprint(
    data: IFingerprintGroup,
  ): Promise<FingerprintGroupAggregate> {
    const group = await this.getRepository(FingerprintGroupEntity).save({
      key: data.key,
    });
    const fingerprints = await this.getRepository(FingerprintEntity).save(
      data.fingerprints,
    );
    return FingerprintGroupAggregate.create({ ...group, fingerprints });
  }

  async getFingerprint(options?: BuilderOptionsDto<IFingerprint>) {
    const repository = this.getRepository(FingerprintEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    console.log(result);
    if (!result) return null;

    return FingerprintAggregate.create(result);
  }

  async getGroupFingerprint(print: string): Promise<FingerprintGroupAggregate> {
    const fingerprint = await this.getFingerprint({
      filter: { field: 'fingerprint', value: print },
    });
    console.log(fingerprint);
    return Promise.resolve(undefined);
  }

  existKey(key: string): Promise<boolean> {
    const repository = this.getRepository(FingerprintGroupEntity);
    const query = HQueryBuilder.select(repository, {
      filter: { field: 'key', value: key },
    });
    return query.builder.getExists();
  }
}
