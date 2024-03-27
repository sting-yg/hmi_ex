import type { XYZ } from "@/views/hmi/model/data/Interface"
export class Lidar {
    data = [] as XYZ[];
    result = '';
    errrorCode = 0;
    message = '';
    dataTime = '';
    fromPacket(param : any){
        if ('data' in param) {
            for(let i=0; i<param.data.length; i++){
                const angle = i / (param.data.length / 2) * Math.PI;
                this.data.push({x : Math.cos(angle) * param.Data[i], y: Math.sin(angle) * param.Data[i], z:0});
            }
        }
        if ('result' in param) this.result = param.result;
        if ('errorCode' in param) this.errrorCode = param.errorCode;
        if ('message' in param) this.message = param.message;
        if ('dataTime' in param) this.dataTime = param.dataTime;
    }   
}