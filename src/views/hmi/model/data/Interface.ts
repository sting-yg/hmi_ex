export interface XY {
    x : number,
    y : number,
}

export interface XYZ {
    x : number,
    y : number,
    z : number,
}

export interface XYZW {
    x : number,
    y : number,
    z : number,
    w : number,
}

export interface XYT {
    x : number,
    y : number,
    theta : number, // angle from +x direction in degree
}

export interface POS_ORI {
    position: XYZ,
    orientation: XYZW
}

export interface Velocity {
    linear: number, // in meter/sec
    angular: number, // in degree/sec
}

export interface RGBb {
    r : number,
    g : number,
    b : number,
}

export interface RGBf {
    r : number,
    g : number,
    b : number,
}

export interface PathPoint {
    x: number,
    y: number,
    degree: number,
}

export function xy2hashkey(p:XY):number {
    return p.x << 16|p.y;
}