import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '@/models/base';
import { AuthorMessageType, IMessage } from '@/models/message';

export const MESSAGE_TABLE = 'messages';

@Entity({ name: MESSAGE_TABLE })
export class MessageEntity extends BaseEntity implements IMessage {
  @PrimaryColumn({ name: 'session_id' })
  session_id: number;

  @Column({
    name: 'author_type',
    type: 'enum',
    enum: AuthorMessageType,
    enumName: 'author_message_type',
  })
  author_type: AuthorMessageType;

  @Column({ nullable: true })
  text: string | null;

  @Column({ name: 'operator_id' })
  operator_id: number | null;
}
