import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import {
  IMessageSession,
  IMessageSessionInstance,
  SessionMode,
} from '@/models/message-session/message-session.interface';
import { IRespondent, RespondentAggregate } from '@/models/respondent';
import { IMessage, MessageAggregate } from '@/models/message';
import { DomainError } from '@/common/error';

export class MessageSessionAggregate implements IMessageSession {
  @IsOptional()
  @IsNumber()
  id?: number;

  /** Индификатор проекта */
  @IsNumber()
  @IsDefined()
  project_id: number;

  /** Индификатор скрипта */
  @IsNumber()
  @IsDefined()
  script_id: number;

  /** Индификатор респондента */
  @IsNumber()
  @IsDefined()
  respondent_id: number;

  @IsDefined()
  @IsEnum(SessionMode)
  mode: SessionMode = SessionMode.SYSTEM;

  @IsDate()
  @IsOptional()
  close_at: Date | null = null;

  @IsDate()
  @IsOptional()
  last_active_at: Date | null = null;

  @IsDate()
  created_at = new Date();

  @IsOptional()
  respondent: RespondentAggregate | null = null;

  @IsOptional()
  messages: MessageAggregate[] = [];

  static create(data: Partial<IMessageSession>) {
    const _entity = new MessageSessionAggregate();
    _entity.update(data);
    return _entity;
  }

  update(data: Partial<IMessageSession>) {
    const { respondent, messages, ...params } = data;
    if (messages) {
      this.messages = [];
      messages.forEach((message) => this.appendMessage(message));
    }
    if (respondent) {
      this.respondent_id = respondent.id;
      this.setRespondent(respondent);
    }

    const entries = Object.entries(params);
    if (entries.length === 0) return;

    entries.forEach(([key, value]) => {
      this[key] = value;
    });
    this.created_at = this.id ? this.created_at : new Date();

    const errors = validateSync(this, { whitelist: true });
    if (!!errors.length) {
      throw new DomainError(errors);
    }
  }

  setRespondent(respondent: IRespondent) {
    this.respondent = RespondentAggregate.create(respondent);
  }

  appendMessage(message: IMessage) {
    this.messages.push(MessageAggregate.create(message));
  }

  active() {
    this.last_active_at = new Date();
  }

  get instance(): IMessageSessionInstance {
    return {
      id: this.id,
      project_id: this.project_id,
      script_id: this.script_id,
      respondent_id: this.respondent_id,
      mode: this.mode,
      created_at: this.created_at,
      close_at: this.close_at,
      last_active_at: this.last_active_at,
    };
  }
}
