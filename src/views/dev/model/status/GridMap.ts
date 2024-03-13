export class GridMap {
    resolution = 0.0;
    origin = [] as number[];
    negate = 0.0;
    occupiedThresh = 0.0;
    freeThresh = 0.0;
    imageData = [];

    fromPacket(param : any) : this { 
        if('resolution' in param) this.resolution = param.resolution;
        if('origin' in param) this.origin = param.origin;
        if('negate' in param) this.negate = param.negate;
        if('occupiedThresh' in param) this.occupiedThresh = param.occupiedThresh;
        if('freeThresh' in param) this.freeThresh = param.freeThresh;
        if('imageData' in param) this.imageData = param.imageData;
        return this;
    }
}