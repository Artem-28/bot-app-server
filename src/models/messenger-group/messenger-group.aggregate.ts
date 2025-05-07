import { IMessengerGroup } from '@/models/messenger-group/messenger-group.interface';
import {
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { MessageSessionAggregate } from '@/models/message-session';
import { DomainError } from '@/common/error';

export class MessengerGroupAggregate implements IMessengerGroup {
  @IsNumber()
  @IsDefined()
  id: number;

  @IsString()
  @IsDefined()
  title: string;

  @IsDate()
  @IsDefined()
  updated_at: Date;

  @IsOptional()
  sessions: MessageSessionAggregate[] = [];

  static create(data: Partial<IMessengerGroup>) {
    const _entity = new MessengerGroupAggregate();
    _entity.update(data);
    return _entity;
  }

  public update(data: Partial<IMessengerGroup>) {
    const { sessions, ...params } = data;

    if (sessions) {
      this.sessions = sessions.map((session) =>
        MessageSessionAggregate.create(session),
      );
    }

    const entries = Object.entries(params);
    if (entries.length === 0) return;

    entries.forEach(([key, value]) => {
      this[key] = value;
    });

    const errors = validateSync(this, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
  }
}
