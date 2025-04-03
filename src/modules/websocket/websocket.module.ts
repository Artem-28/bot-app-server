import { Module } from '@nestjs/common';
import { MessengerWebsocket } from '@/modules/websocket/messenger.websocket';

@Module({
  providers: [MessengerWebsocket],
  controllers: [],
})
export class WebsocketModule {}
