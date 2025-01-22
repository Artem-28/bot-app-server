import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/models/base';

export const AUTH_DATA_TABLE = 'auth_data';

@Entity({ name: AUTH_DATA_TABLE })
export class AuthDataEntity extends BaseEntity {
  @Column()
  public login: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ name: 'access_token', nullable: true })
  @Exclude()
  public accessToken: string;
}
