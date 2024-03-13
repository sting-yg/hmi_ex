import { uuidv4 } from "@/views/dev/util/Uuid";
import type { XYT } from "@/views/dev/model/data/Interfaces"

export class PathNode{
    _isDirty : boolean;
    id : string;
    name : string;
    pose : XYT;

    constructor (){
        this._isDirty = true;
        this.id = uuidv4();
        this.name = "";
        this.pose = { x: 0, y: 0, theta: 0}
    }
}