import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/models/base';

export const USER_TABLE = 'users';

@Entity({ name: USER_TABLE })
export class UserEntity extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column({ nullable: true })
  public phone: string;

  @Column({ name: 'license_agreement' })
  public license_agreement: boolean;

  @Column({ name: 'email_verified_at', nullable: true })
  public email_verified_at: Date;

  @Column({ name: 'phone_verified_at', nullable: true })
  public phone_verified_at: Date;

  @Column({ name: 'last_active_at', nullable: true })
  public last_active_at: Date;
}
