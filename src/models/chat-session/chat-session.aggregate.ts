import { BaseAggregate } from '@/models/base';
import { IChatSession } from '@/models/chat-session/chat-session.interface';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
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

  static create(data: Partial<IChatSession>) {
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
