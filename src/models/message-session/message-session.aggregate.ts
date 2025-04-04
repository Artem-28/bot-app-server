import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseAggregate } from '@/models/base';
import {
  IMessageSession,
  IMessageSessionInstance,
} from '@/models/message-session/message-session.interface';
import { RespondentAggregate } from '@/models/respondent';

export class MessageSessionAggregate
  extends BaseAggregate<IMessageSession>
  implements IMessageSession
{
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

  /** Название сессии */
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  title: string;

  @IsDate()
  @IsOptional()
  end_at: Date | null = null;

  @IsOptional()
  respondent: RespondentAggregate | null = null;

  static create(data: Partial<IMessageSession>) {
    const _entity = new MessageSessionAggregate();
    _entity.update(data);
    return _entity;
  }

  update(data: Partial<IMessageSession>) {
    const { respondent, ...params } = data;
    if (respondent) {
      this.respondent_id = respondent.id;
      this.respondent = RespondentAggregate.create(respondent);
    }
    super.update(params);
  }

  get instance(): IMessageSessionInstance {
    return {
      id: this.id,
      project_id: this.project_id,
      script_id: this.script_id,
      respondent_id: this.respondent_id,
      title: this.title,
      end_at: this.end_at,
      crated_at: this.crated_at,
      updated_at: this.updated_at,
    };
  }
}
