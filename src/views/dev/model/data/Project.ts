import type {XY} from '@/views/dev/model/data/Interfaces'
import { PathNode } from "@/views/dev/model/data/PathNode"

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

    setImageWidth(width: number): this {
        this.imageWidth = width;
        return this;
    }

    setImageHeight(height: number): this {
        this.imageHeight = height;
        return this;
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

    setNodes(nodes : PathNode[]) : this {
        this.nodes = nodes;
        return this;
    }
}