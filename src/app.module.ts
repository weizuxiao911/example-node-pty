import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketModule } from './websocket/websocket.module';
import { AppWebsocket } from './app.websocket';

@Module({
  imports: [WebsocketModule],
  controllers: [AppController],
  providers: [AppService, AppWebsocket],
})
export class AppModule {}
