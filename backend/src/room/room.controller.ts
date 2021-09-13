import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    
    @Inject()
    service: RoomService; 

    @Get()
    public getRooms(){
        return "ALl rooms...";
    }

    @Get('default')
    public getTest(){
        return this.service.getDefault();
    }
}
