import { BaseAggregate } from '@/models/base';
import { IChatSession } from '@/models/chat-session/chat-session.interface';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { IConfirmCode } from '@/models/confirm-code';
import { DomainError } from '@/common/error';

export class ChatSessionAggregate
  extends BaseAggregate<IChatSession>
  implements IChatSession
{
  /** Индификатор проекта */
  @IsNumber()
  @IsDefined()
  projectId: number;

  /** Индификатор скрипта */
  @IsNumber()
  @IsDefined()
  scriptId: number;

  /** Индификатор респондента */
  @IsNumber()
  @IsDefined()
  respondentId: number;

  /** Название сессии */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  title: string;

  /** Время окончания сессии */
  @IsDate()
  overAt: Date | null = null;

  static create(data: Partial<IConfirmCode>) {
    const _entity = new ChatSessionAggregate();
    Object.assign(_entity, data);
    _entity.createdAt = data?.id ? _entity.createdAt : new Date();
    const errors = validateSync(_entity, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
    return _entity;
  }

  get instance(): IChatSession {
    return {
      id: this.id,
      projectId: this.projectId,
      scriptId: this.scriptId,
      respondentId: this.respondentId,
      title: this.title,
      overAt: this.overAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
