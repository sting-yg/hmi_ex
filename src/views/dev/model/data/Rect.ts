import * as THREE from 'three';
import type {XY} from './Interfaces'

export class Rect {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x : number, y : number, w : number, h : number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get minx() { return this.x; }
    get miny() { return this.y; }
    get maxx() { return this.x + this.w; }
    get maxy() { return this.y + this.h; }
    get dx() { return this.w; }
    get dy() { return this.h; }
    get cx() { return (this.minx + this.maxx)/2; }
    get cy() { return (this.miny + this.maxy)/2; }
    get radius() { return Math.sqrt(this.dx*this.dx + this.dy*this.dy); }
    get center() : XY { return {x:this.cx, y:this.cy}; }

    setAspect(aspect : number, fixWidth = true) : this {
        if(fixWidth) 
        {
            const c = this.clone();
            this.h = this.dx * aspect;
            this.y = c.cy - this.h / 2;
        }
        else
        {
            const c = this.clone();        
            this.w = this.dy / aspect;
            this.x = c.cx - this.w / 2;
        }
        return this;
    }

    get aspect() { return this.h / this.w; }

    set(x:number, y:number, w:number, h:number) : this {
        this.x = x;
        this.y = y;              
        this.w = w;
        this.h = h;
        return this;
    }

    copyFrom(rect : Rect) : this {
        this.x = rect.x;
        this.y = rect.y;              
        this.w = rect.w;
        this.h = rect.h;
        return this;
    }

    clone() : Rect {
        return new Rect(this.x, this.y, this.w, this.h);
    }

    expandByRatio(ratio : number, zoomCenter: XY|null = null) : this {
        if(zoomCenter == null) {
            const c = this.clone();
            this.x = c.cx - c.dx * 0.5 * ratio;
            this.y = c.cy - c.dy * 0.5 * ratio;
            this.w = c.dx * ratio;
            this.h = c.dy * ratio;
        }
        else {
            // zoomCenter 좌표가 변하지 않아야 함
            // P' - zoomCenter = ratio * (P - zoomCenter) for every P
            // P' = ratio * P + (1 - ratio) * zoomCenter;
            const c = this.clone();
            this.x = ratio * c.minx + (1-ratio) * zoomCenter.x;
			this.y = ratio * c.miny + (1-ratio) * zoomCenter.y; 
            this.w = c.dx * ratio;
            this.h = c.dy * ratio;
        }
        return this;
    }

    expand(xoffset : number, yoffset : number) : this {
        const c = this.clone();
        this.x = c.x - xoffset;
        this.y = c.y - yoffset;
        this.w = c.w + xoffset * 2;
        this.h = c.h + yoffset * 2;
        return this;
    }

    offset(xoffset : number, yoffset : number) : this {
        this.x = this.x + xoffset;
        this.y = this.y + yoffset;
        return this;
    }

    contains(p : XY) : boolean {
        return p.x >= this.minx && p.x <= this.maxx && p.y >= this.miny && p.y <= this.maxy;
    }

    setBox(p : XY) : this  {
        this.x = p.x;
        this.y = p.y;
        this.w = 0;
        this.h = 0;
        return this;
    }

    updateBox(p : XY) : this {
        const c = this.clone();

        if(p.x < c.minx) {            
            this.x = p.x;
            this.w = c.w + Math.abs(c.minx - p.x);
        }
        else if(p.x > c.maxx) {
            this.w = c.w + Math.abs(c.maxx - p.x);
        }

        if(p.y < c.miny) {
            this.y = p.y;
            this.h = c.h + Math.abs(c.miny - p.y);
        }
        else if(p.y > c.maxy) {
            this.h = c.h + Math.abs(c.maxy - p.y);
        }
        return this;
    }

    get cornerPoints(): XY[] {
        return [
            {x: this.minx, y: this.miny},
            {x: this.maxx, y: this.miny},
            {x: this.maxx, y: this.maxy},
            {x: this.minx, y: this.maxy},
        ];
    }

    get loopPoints(): XY[] {
        return [
            {x: this.minx, y: this.miny},
            {x: this.maxx, y: this.miny},
            {x: this.maxx, y: this.maxy},
            {x: this.minx, y: this.maxy},
            {x: this.minx, y: this.miny},
        ];
    }

    gridXs(interval:number) : number[] {
        const vals = [];
        for(let v = this.cx; v > this.minx; v -= interval) {
            vals.push(v);
        }
        vals.push(this.minx);

        for(let v = this.cx + interval; v < this.maxx; v+= interval) {
            vals.push(v);
        }
        vals.push(this.maxx);
        return vals;
    }

    gridYs(interval:number) : number[] {
        const vals = [];
        for(let v = this.cy; v > this.miny; v -= interval) {
            vals.push(v);
        }
        vals.push(this.miny);

        for(let v = this.cy + interval; v < this.maxy; v+= interval) {
            vals.push(v);
        }
        vals.push(this.maxy);
        return vals;
    }

    applyMatrix(mat : THREE.Matrix4) : this {
        const corners = this.cornerPoints.map(x => new THREE.Vector3(x.x, x.y, 0)).map(x => x.applyMatrix4(mat));        
        this.setBox(corners[0]);
        this.updateBox(corners[1]);
        this.updateBox(corners[2]);
        this.updateBox(corners[3]);
        return this;
    }

    mergeBox(box: Rect) : this {
        box.cornerPoints.forEach(x => this.updateBox(x));
        return this;
    }

    fromPacket(param : any) : this
    {
        if('X' in param) this.x = param.X;
        if('Y' in param) this.y = param.Y;
        if('W' in param) this.w = param.W;
        if('H' in param) this.h = param.H;
        return this;
    }
}