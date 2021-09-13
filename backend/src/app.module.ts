import { Module } from '@nestjs/common';
//import { AppService } from './app.service';
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';

@Module({
  imports: [],
  controllers: [RoomController],
  providers: [RoomService],
})
export class AppModule {}
