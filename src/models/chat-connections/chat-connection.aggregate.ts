import { BaseAggregate } from '@/models/base';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { DomainError } from '@/common/error';
import { Exclude } from 'class-transformer';
import {
  IChatConnection,
  IChatConnectionRelation,
} from '@/models/chat-connections/chat-connection.interface';
import { RespondentAggregate } from '@/models/respondent';
import { UserAggregate } from '@/models/user';
import { ScriptAggregate } from '@/models/script';

export class ChatConnectionAggregate
  extends BaseAggregate<IChatConnection>
  implements IChatConnection
{
  /** Ключ сессии */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Exclude()
  key: string;

  /** Индификатор проекта */
  @IsNumber()
  @IsDefined()
  projectId: number;

  /** Индификатор скрипта */
  @IsNumber()
  @IsOptional()
  scriptId: number | null = null;

  /** Индификатор респондента */
  @IsNumber()
  @IsOptional()
  respondentId: number | null = null;

  @IsNumber()
  @IsOptional()
  userId: number | null = null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  socketId: string | null = null;

  @IsBoolean()
  @IsOptional()
  connected: boolean = false;

  @IsOptional()
  respondent: RespondentAggregate | null = null;

  @IsOptional()
  operator: UserAggregate | null = null;

  @IsOptional()
  script: ScriptAggregate | null = null;

  static create(data: Partial<IChatConnection>) {
    const _entity = new ChatConnectionAggregate();
    Object.assign(_entity, data);
    _entity.createdAt = data?.id ? _entity.createdAt : new Date();
    const errors = validateSync(_entity, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return _entity;
  }

  get instance(): IChatConnection {
    return {
      id: this.id,
      key: this.key,
      projectId: this.projectId,
      scriptId: this.scriptId,
      respondentId: this.respondentId,
      userId: this.userId,
      socketId: this.socketId,
      connected: this.connected,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(data: Partial<IChatConnection & IChatConnectionRelation>) {
    super.update(data);

    if (
      data.hasOwnProperty('respondent') &&
      data.respondent instanceof RespondentAggregate
    ) {
      this.respondent = data.respondent;
    }

    if (
      data.hasOwnProperty('script') &&
      data.script instanceof ScriptAggregate
    ) {
      this.script = data.script;
    }

    if (
      data.hasOwnProperty('operator') &&
      data.operator instanceof UserAggregate
    ) {
      this.operator = data.operator;
    }
  }
}
