import { BaseRepository } from '@/repositories/base.repository';
import { FingerprintRepositoryDomain } from '@/repositories/fingerprint/fingerprint-repository.domain';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
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

  async createFingerprintGroup(
    data: IFingerprintGroup,
  ): Promise<FingerprintGroupAggregate> {
    const group = await this.getRepository(FingerprintGroupEntity).save(data);
    return FingerprintGroupAggregate.create(group);
  }

  async getFingerprint(options?: BuilderOptionsDto<IFingerprint>) {
    const repository = this.getRepository(FingerprintEntity);
    const query = HQueryBuilder.select(repository, options);

    const result = await query.builder.getOne();
    if (!result) return null;
    return FingerprintAggregate.create(result);
  }

  existKey(key: string): Promise<boolean> {
    const repository = this.getRepository(FingerprintGroupEntity);
    const query = HQueryBuilder.select(repository, {
      filter: { field: 'key', value: key },
    });
    return query.builder.getExists();
  }

  updateFingerprint(
    fingerprint: string,
    data: Partial<IFingerprint>,
  ): Promise<UpdateResult> {
    return this.getRepository(FingerprintEntity)
      .createQueryBuilder()
      .update()
      .set(data)
      .where({ fingerprint })
      .execute();
  }

  async getFingerprintGroup(key: string): Promise<FingerprintGroupAggregate> {
    const repository = this.getRepository(FingerprintGroupEntity);
    const query = HQueryBuilder.select(repository, {
      filter: { field: 'key', value: key },
      relation: { name: 'fingerprints', method: 'leftJoinAndSelect' },
    });
    const result = await query.builder.getOne();
    if (!result) return null;
    return FingerprintGroupAggregate.create(result);
  }
}
