import { BaseAggregate } from '@/models/base';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IMessageSession } from '@/models/message-session/message-session.interface';

export class MessageSessionAggregate
  extends BaseAggregate<IMessageSession>
  implements IMessageSession
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

  @IsDate()
  @IsOptional()
  endAt: Date | null = null;

  static create(data: Partial<IMessageSession>) {
    const _entity = new MessageSessionAggregate();
    _entity.update(data);
    return _entity;
  }

  get instance(): IMessageSession {
    return {
      id: this.id,
      projectId: this.projectId,
      scriptId: this.scriptId,
      respondentId: this.respondentId,
      title: this.title,
      endAt: this.endAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
