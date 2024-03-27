import type { XY,XYZ } from '@/views/dev/model/data/Interfaces'
import { PathNode } from "@/views/dev/model/data/PathNode"
import { Rect } from './Rect';

export class ProjectMap{
    imageWidth: number;
    imageHeight: number;
    resolution: number;
    originOffset: XY;
    mapImage = null as null|ImageBitmap;

    constructor(){
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.resolution = 0.01;
        this.originOffset = {x:0, y:0};
    }

    setMapImage(mapImage : ImageBitmap){
        this.mapImage = mapImage;
        return this;
    }

    setResolution(resolution : number){
        this.resolution = resolution;
        return this;
    }

    setOffsetX(originX : number) : this {
        this.originOffset.x = originX;
        return this;
    }

    setOffsetY(originY : number) : this {
        this.originOffset.y = originY;
        return this;
    }

    setImageWidth(width: number): this {
        this.imageWidth = width;
        return this;
    }

    setImageHeight(height: number): this {
        this.imageHeight = height;
        return this;
    }
    get imageWidthPixel() { return this.mapImage == null ? 100 : this.mapImage.width;}
    get imageHeightPixel() { return this.mapImage == null ? 100 : this.mapImage.height;}

    get rect() {        
        const w = this.imageWidthPixel * this.resolution;
        const h = this.imageHeightPixel * this.resolution;
        return new Rect(w/-2 - this.originOffset.x, h/-2 - this.originOffset.y, w, h);
    }

    worldToPixel(p: XYZ): XY {
        return {
            x: Math.floor((p.x + this.originOffset.x) / this.resolution + this.imageWidth/2),
            y: Math.floor(this.imageHeight/2 - (p.y + this.originOffset.y) / this.resolution)
        }
    }

    copy(other: ProjectMap): this {
        // edit 단계에서 string으로 바뀔 수 있으므로 number로 변환 체크
        this.setResolution(Number(other.resolution));
        this.setOffsetX(Number(other.originOffset.x));
        this.setOffsetY(Number(other.originOffset.y));
        this.setImageWidth(Number(other.imageWidth));
        this.setImageHeight(Number(other.imageHeight));
        this.mapImage = other.mapImage;
        return this;
    }

    clone() : ProjectMap {
        return new ProjectMap().copy(this);
    }
}

export class Project {
    id : number | null;
    name : string;
    map : ProjectMap;
    nodes : PathNode[] 

    constructor () {
        this.id = null;
        this.name = "";
        this.map = new ProjectMap();
        this.nodes = [];
    }

    setMap(map : ProjectMap) : this {
        this.map = map;
        return this;
    }

    setNode(nodes : PathNode[]) : this {
        this.nodes = nodes;
        return this;
    }
}