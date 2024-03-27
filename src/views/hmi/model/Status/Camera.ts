import type { XYZ } from "@/views/hmi/model/data/Interface"
export class Camera {
    data = [] as XYZ[];
    result = '';
    errorCode = '';
    message = '';
    datetime = '';

    fromPacket(param: any){
        if('data' in param){
            for(let i=0; i<param.data.length; i++){
                const angle = i / (param.LidarData.data.length / 2) * Math.PI;
                this.data.push({x: Math.cos(angle) * param.Data[i], y: Math.sin(angle) * param.Data[i], z:0});
            }
        }
        if ('result' in param) this.result = param.result;
        if ('errorCode' in param) this.errorCode = param.errorCode;
        if ('message' in param) this.message = param.message;
        if ('datetime' in param) this.datetime = param.datatime;
    }
}