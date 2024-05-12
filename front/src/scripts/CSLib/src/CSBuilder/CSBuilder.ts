import * as THREE from 'three';
import { CSDXFObjectType, CSDXFObject, CSLineType } from '../CSObjects';
import type { IDxfParsedObj } from '../CSUtils/CSDXFParser';
import type { ICSBuilder } from './ICSBuilder';

export class _CSBuilder implements ICSBuilder {

    public createDxfObject( dxfObj: IDxfParsedObj ) {
        switch( dxfObj.type ){
            case CSDXFObjectType.POLYLINE:
            case CSDXFObjectType.LWPOLYLINE:
            case CSDXFObjectType.LINE: 
            case CSDXFObjectType.ELLIPSE:
            case CSDXFObjectType.SPLINE:
            {
                const opts = { radius: 40 }
                const { object3D, raycastObject3D } = this._createPolyline( dxfObj, opts );
                // return new CSDXFObject( dxfObj.type, dxfObj.layer, object3D, raycastObject3D );
            }
            case CSDXFObjectType.ARC:
            case CSDXFObjectType.CIRCLE: 
            {
                const opts = { radius: 40 }
                const { object3D, raycastObject3D } = this._createArc( dxfObj, opts );
                // return new CSDXFObject( dxfObj.type, dxfObj.layer, object3D, raycastObject3D );
            }
            case CSDXFObjectType.POINT: 
            {
                const opts = { r1: 20, r2: 40 }
                const { object3D, raycastObject3D } = this._createPoint( dxfObj, opts );
                // return new CSDXFObject( dxfObj.type, dxfObj.layer, object3D, raycastObject3D );
            }
        }
    }

    private _createPolyline( dxfObj: IDxfParsedObj, opts: { radius: number } ): { object3D: THREE.Line, raycastObject3D: THREE.Mesh } {
        const geometry = this._createBufferGeometry( dxfObj.points );
        const line = this._createLine( geometry, dxfObj.color, dxfObj.lineType );

        // const isClosed = dxfObj.points[0] === dxfObj.points[ dxfObj.points.length - 1 ];
        const isClosed = false;
        const points = dxfObj.points.map( p => p );
        // points.pop();
        const curve = new THREE.CatmullRomCurve3( points, isClosed, 'catmullrom', 0 );
        const geo = new THREE.TubeGeometry( curve, points.length * 10, opts.radius, 6, false );
        this._rotateBG90( geo );
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const mesh = new THREE.Mesh( geo, material );

        return {
            object3D: line,
            raycastObject3D: mesh
        };
    }

    private _createArc( dxfObj: IDxfParsedObj, opts: { radius: number } ): { object3D: THREE.Line, raycastObject3D: THREE.Mesh } {  
        const geometry = this._createBufferGeometry( dxfObj.points );
        const line = this._createLine( geometry, dxfObj.color, dxfObj.lineType );

        line.position.x = dxfObj.origin.x;
        line.position.y = dxfObj.origin.y;
        line.position.z = dxfObj.origin.z;

        // const isClosed = dxfObj.points[0] === dxfObj.points[ dxfObj.points.length - 1 ];
        const isClosed = true;
        const curve = new THREE.CatmullRomCurve3( dxfObj.points, isClosed, 'catmullrom', 0 );
        const geo = new THREE.TubeGeometry( curve, dxfObj.points.length, opts.radius, 8, false );
        this._rotateBG90( geo );
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const mesh = new THREE.Mesh( geo, material );
        mesh.position.x = dxfObj.origin.x;
        mesh.position.y = dxfObj.origin.y;
        mesh.position.z = dxfObj.origin.z;

        return {
            object3D: line,
            raycastObject3D: mesh
        };
    }

    private _createPoint( dxfObj: IDxfParsedObj, opts: { r1: number, r2: number } ): { object3D: THREE.Mesh, raycastObject3D: THREE.Mesh } {
        
        const geometry = new THREE.SphereGeometry( opts.r1, 8, 8 );
        this._rotateBG90( geometry );
        geometry.computeBoundingBox();
        
        const mat1 = new THREE.MeshBasicMaterial({ color: dxfObj.color });
        const point = new THREE.Mesh( geometry, mat1 );
        
        const p = dxfObj.points[0];
        point.position.set( p.x, p.z, -p.y );

        const geo = new THREE.SphereGeometry( opts.r2, 8, 8 );
        this._rotateBG90( geo );
        const mat2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const mesh = new THREE.Mesh( geo, mat2 );
        mesh.position.copy( point.position );

        return {
            object3D: point,
            raycastObject3D: mesh
        };
    }

    private _createBufferGeometry( points: THREE.Vector3[] ){
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        this._rotateBG90( geometry );
        geometry.computeBoundingBox();
        return geometry;
    }

    private _createLine( geometry: THREE.BufferGeometry, color: number, lineType: CSLineType ){
        const material = lineType === CSLineType.NORMAL
            ? new THREE.LineBasicMaterial({ linewidth: 1, color })
            : new THREE.LineDashedMaterial({ color, gapSize: 4, dashSize: 4 });

        const line = new THREE.Line( geometry, material );
        return line;
    }

    private _rotateBG90( bufferGeometry: THREE.BufferGeometry | THREE.Object3D ){
        bufferGeometry.rotateX( Math.PI / -2 );
    }
}