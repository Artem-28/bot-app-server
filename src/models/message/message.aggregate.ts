import { BaseAggregate } from '@/models/base';
import { AuthorMessageType, IMessage } from '@/models/message';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MessageSessionAggregate } from '@/models/message-session';
import { IUser, UserAggregate } from '@/models/user';

export class MessageAggregate
  extends BaseAggregate<IMessage>
  implements IMessage
{
  @IsNumber()
  @IsDefined()
  session_id: number;

  @IsNumber()
  @IsOptional()
  operator_id: number | null = null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text: string | null = null;

  @IsDefined()
  @IsEnum(AuthorMessageType)
  author_type: AuthorMessageType;

  session: MessageSessionAggregate | null = null;

  @IsOptional()
  operator: UserAggregate | null = null;

  static create(data: Partial<IMessage>) {
    const _entity = new MessageAggregate();
    _entity.update(data);
    return _entity;
  }

  setSession(data: MessageSessionAggregate) {
    this.session = data;
  }

  setOperator(data: IUser) {
    this.operator = UserAggregate.create(data);
  }

  get instance(): IMessage {
    return {
      id: this.id,
      session_id: this.session_id,
      operator_id: this.operator_id,
      author_type: this.author_type,
      text: this.text,
      crated_at: this.crated_at,
      updated_at: this.updated_at,
    };
  }

  public transform() {
    let operator: Partial<IUser> | null = null;
    if (this.operator) {
      operator = { name: this.operator.name };
    }
    return {
      id: this.id,
      text: this.text,
      author_type: this.author_type,
      crated_at: this.crated_at,
      updated_at: this.updated_at,
      operator,
      session: this.session,
    };
  }
}
