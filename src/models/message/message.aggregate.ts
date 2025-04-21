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
import { UserAggregate } from '@/models/user';
import { RespondentAggregate } from '@/models/respondent';

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

  author: UserAggregate | RespondentAggregate | null = null;

  static create(data: Partial<IMessage>) {
    const _entity = new MessageAggregate();
    _entity.update(data);
    return _entity;
  }

  setSession(data: MessageSessionAggregate) {
    this.session = data;
  }

  setAuthor(data: UserAggregate | RespondentAggregate) {
    this.author = data;
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
}
