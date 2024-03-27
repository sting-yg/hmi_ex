import type { XY } from "@/views/hmi/model/data/Interface"

export class Obstacle {
    data = [] as XY [];
    result = '';
    errorCode = 0;
    message = '';
    dateTime = '';
    
    fromPacket(param: any){
        if('data' in param) this.data = param.data;
        if('result' in param) this.result = param.result;
        if('message' in param) this.message = param.data;
        if('dataTime' in param) this.dateTime = param.dataTime
    }
}