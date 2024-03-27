
import * as THREE from 'three'
import { Rect } from '@/dev/model/data/Rect'
import type { XYZ, XY } from "@/dev/model/data/Interfaces"

export class DrawShape {
    static robot(rect:Rect, z:number, includeCenterEdge:boolean = true) : {vertices:XYZ[],triangles:number[][], edges:number[][]} {
        //  3---------9--------2
        //  |                  |
        //  4-5                |
        //    |A               |B                   
        //  7-6                |
        //  |                  |
        //  0---------8--------1
        const vertices = [
            new THREE.Vector3(rect.minx, rect.miny, z), //0
            new THREE.Vector3(rect.maxx, rect.miny, z), //1 
            new THREE.Vector3(rect.maxx, rect.maxy, z), //2
            new THREE.Vector3(rect.minx, rect.maxy, z), //3
            new THREE.Vector3(rect.minx, 0.2, z), //4
            new THREE.Vector3(rect.minx+0.1, 0.2, z), //5
            new THREE.Vector3(rect.minx+0.1, -0.2, z), //6
            new THREE.Vector3(rect.minx, -0.2, z), //7
            new THREE.Vector3(0, rect.miny, z), //8
            new THREE.Vector3(0, rect.maxy, z), //9
            new THREE.Vector3(rect.minx+0.1, 0, z), //A
            new THREE.Vector3(rect.maxx, 0, z), //B
        ];        
        const triangles = [
            [0,6,7],
            [0,1,6],
            [1,2,6],
            [6,2,5],
            [5,2,3],
            [5,3,4],
        ]

        const edges = [
            [0,1],
            [1,2],
            [2,3],
            [3,4],
            [4,5],
            [5,6],
            [6,7],
            [7,0],
        ];

        if(includeCenterEdge) {
            edges.push([8,9]);
            edges.push([10,11]);
        }

        return {vertices,triangles,edges}
    } 
    
    static rectRing(ctx:number, cty:number, x1: number, y1: number, x2: number, y2:number, z:number) : {vertices:XYZ[],triangles:number[][], edges:number[][]} {
        //  3------------------2
        //  |   7-----------6  |
        //  |   |           |  |
        //  |   |           |  |                   
        //  |   |           |  |
        //  |   4-----------5  |
        //  0------------------1
        const vertices = [
            new THREE.Vector3(ctx - x2, cty - y2, z), //0
            new THREE.Vector3(ctx + x2, cty - y2, z), //1 
            new THREE.Vector3(ctx + x2, cty + y2, z), //2
            new THREE.Vector3(ctx - x2, cty + y2, z), //3
            new THREE.Vector3(ctx - x1, cty - y1, z), //4
            new THREE.Vector3(ctx + x1, cty - y1, z), //5 
            new THREE.Vector3(ctx + x1, cty + y1, z), //6
            new THREE.Vector3(ctx - x1, cty + y1, z), //7
        ];        
        const triangles = [
            [0,5,4],
            [0,1,5],
            [1,6,5],
            [1,2,6],
            [2,7,6],
            [2,3,7],
            [3,4,7],
            [3,0,4]
        ]

        const edges = [
            [0,1],
            [1,2],
            [2,3],
            [3,0],
            [4,5],
            [5,6],
            [6,7],
            [7,4],
        ]

        return {vertices,triangles,edges}
    } 

    static sphere(ctx:number, cty:number, z:number, r: number, piece: number) : {vertices:XYZ[],triangles:number[][], edges:number[][]} 
    {
        const vertices = [];
        for(let j=0; j<piece; j++)
        {
            vertices.push({x: ctx + r * Math.cos(Math.PI * 2 * j / piece), y: cty + r * Math.sin(Math.PI * 2 * j / piece), z: z});
        }

        const triangles = [];
        for(let j=0; j<piece-2; j++)
        {
            triangles.push([0, j+1, j+2]);
        };

        const edges = [];
        for(let j=0; j<piece-1; j++)
        {
            edges.push([j, j+1]);
        };
        edges.push([piece-1, 0]);

        return {vertices,triangles,edges}
    } 
}