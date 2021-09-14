import { Module } from '@nestjs/common';
//import { AppService } from './app.service';
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';
import { AudioGateway } from './audio/audio.gateway';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [AudioModule],
  controllers: [RoomController],
  providers: [RoomService, AudioGateway],
})
export class AppModule {}
