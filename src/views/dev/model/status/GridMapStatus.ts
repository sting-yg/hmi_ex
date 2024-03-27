import type { XY, POS2 } from "@/views/dev/model/data/Interfaces"

export class GridMapStatus{
    mapLoadTime = "";
    data = [] as any [];
    resolution = 0.0;
    width = 0;
    height = 0;
    originPoint = {x:0,y:0} as XY;
    originQuaternion = {x:0, y:0, z:0, w:null} as POS2;

    fromPacket(param: any) : this {
        if('mapLoadTime' in param) this.mapLoadTime = param.mapLoadTime;
        if('data' in param) this.data = param.data;
        if('resolution' in param) this.resolution = param.resolution;
        if('width' in param) this.width = param.width;
        if('height' in param) this.height = param.height;
        if('originPoint' in param) this.originPoint = param.originPoint;
        if('originQuaternion' in param) this.originQuaternion = param.originQuaternion;
        return this;
    }
}
