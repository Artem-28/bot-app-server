import { MessageSessionAggregate } from '@/models/message-session';

export interface IMessengerGroup {
  id: number;
  title: string;
  sessions?: MessageSessionAggregate[];
}
