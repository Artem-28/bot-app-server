import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { SubscriberRepository } from '@/repositories/subscriber';
import { UserRepository } from '@/repositories/user';

@Module({
  providers: [SubscriberService, SubscriberRepository, UserRepository],
  controllers: [SubscriberController],
})
export class SubscriberModule {}
