import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';
import { ConfirmCodeTypeEnum } from '@/models/confirm-code';

export const CONFIRM_CODE_TABLE = 'confirm_codes';

@Entity({ name: CONFIRM_CODE_TABLE })
export class ConfirmCodeEntity extends BaseEntity {
  @Column()
  value: string;

  @Column({
    type: 'enum',
    enum: ConfirmCodeTypeEnum,
    enumName: 'confirm_code_type',
  })
  type: ConfirmCodeTypeEnum;

  @Column()
  destination: string;

  @Column({ name: 'live_at' })
  liveAt: Date;

  @Column({ name: 'delay_at' })
  delayAt: Date;
}
