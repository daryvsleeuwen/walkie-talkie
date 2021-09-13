import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {


    getDefault() : String {
        return "this is the default answer....";
    }
}
