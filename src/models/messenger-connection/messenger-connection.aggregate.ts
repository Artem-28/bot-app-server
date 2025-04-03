import { BaseAggregate } from '@/models/base';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RespondentAggregate } from '@/models/respondent';
import { UserAggregate } from '@/models/user';
import {
  IMessengerConnection,
  IMessengerConnectionInstance,
} from '@/models/messenger-connection/messenger-connection.interface';
import { MessageSessionAggregate } from '@/models/message-session';

export class MessengerConnectionAggregate
  extends BaseAggregate<IMessengerConnection>
  implements IMessengerConnection
{
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  client_id: string;

  /** Индификатор проекта */
  @IsNumber()
  @IsDefined()
  project_id: number;

  /** Индификатор скрипта */
  @IsNumber()
  @IsOptional()
  session_id: number | null = null;

  @IsNumber()
  @IsOptional()
  operator_id: number | null = null;

  @IsOptional()
  operator: UserAggregate | null = null;

  @IsOptional()
  session: MessageSessionAggregate | null = null;

  static create(data: Partial<IMessengerConnection>) {
    const _entity = new MessengerConnectionAggregate();
    _entity.update(data);
    return _entity;
  }

  get instance(): IMessengerConnectionInstance {
    return {
      id: this.id,
      client_id: this.client_id,
      project_id: this.project_id,
      session_id: this.session_id,
      operator_id: this.operator_id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  update(data: Partial<IMessengerConnection>) {
    const { operator, session, ...params } = data;

    if (session) {
      this.session = MessageSessionAggregate.create(session);
      this.session_id = session.id;
    }

    if (operator) {
      this.operator = UserAggregate.create(operator);
      this.operator_id = operator.id;
    }

    super.update(params);
  }
}
