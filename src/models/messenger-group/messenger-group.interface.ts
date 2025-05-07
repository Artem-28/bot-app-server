import { MessageSessionAggregate } from '@/models/message-session';

export interface IMessengerGroup {
  id: number;
  title: string;
  updated_at: Date;
  sessions?: MessageSessionAggregate[];
}