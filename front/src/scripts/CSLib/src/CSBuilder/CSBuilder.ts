import * as THREE from 'three';
import { CSLineType, CSObjectType, type CSObjectMap, type ICSObject } from "../CSObjects/ICSObject";
import type { IDxfParsedObj } from "../CSUtils/CSDXFParser";
import type { ICSBuilder } from "./ICSBuilder";
import { CSObject } from '../CSObjects/CSObject';

export class CSBuilder implements ICSBuilder {
    
    constructor(){
        
    }
    create<T extends CSObjectType>( dxfObj: IDxfParsedObj ): CSObject<T> {
        throw new Error( 'Method not implemented.' );
    }

    public createRaw( dxfObj: IDxfParsedObj ): THREE.Object3D {
        switch( dxfObj.type ){
            case CSObjectType.POLYLINE: {
                return this._createPolyline( dxfObj );
            }
            case CSObjectType.LWPOLYLINE: {
                return this._createLwPolyline( dxfObj );
            }
            case CSObjectType.LINE: {
                return this._createLine( dxfObj );
            }
            case CSObjectType.ARC: {
                return this._createArc( dxfObj );
            }
            case CSObjectType.CIRCLE: {
                return this._createCircle( dxfObj );
            }
            case CSObjectType.ELLIPSE: {
                return this._createEllipse( dxfObj );
            }
            case CSObjectType.SPLINE: {
                return this._createSpline( dxfObj );
            }
            case CSObjectType.POINT: {
                return this._createPoint( dxfObj );
            }
        }
    }

    private _createPolyline( dxfObj: IDxfParsedObj ): THREE.Object3D {
        const geometry = new THREE.BufferGeometry().setFromPoints( dxfObj.points );
        geometry.rotateX( Math.PI / -2 );

        let material;
        switch( dxfObj.lineType ){
            case CSLineType.DASHED: {
                material = new THREE.LineDashedMaterial({ color: dxfObj.color, gapSize: 4, dashSize: 4 });
                break;
            }
            case CSLineType.NORMAL: {
                material = new THREE.LineBasicMaterial({ linewidth: 1, color: dxfObj.color });
                break;
            }
        }

        const line = new THREE.Line( geometry, material );

        return line;
    }

    private _createLwPolyline( dxfObj: IDxfParsedObj ): THREE.Object3D {

        const geometry = new THREE.BufferGeometry().setFromPoints( dxfObj.points );
        geometry.rotateX( Math.PI / -2 );

        let material;
        switch( dxfObj.lineType ){
            case CSLineType.DASHED: {
                material = new THREE.LineDashedMaterial({ color: dxfObj.color, gapSize: 4, dashSize: 4 });
                break;
            }
            case CSLineType.NORMAL: {
                material = new THREE.LineBasicMaterial({ linewidth: 1, color: dxfObj.color });
                break;
            }
        }

        const line = new THREE.Line( geometry, material );
        return line;
    }

    private _createLine( dxfObj: IDxfParsedObj ): THREE.Object3D {
        
        const geometry = new THREE.BufferGeometry().setFromPoints( dxfObj.points );
        geometry.rotateX( Math.PI / -2 );

        const material = new THREE.LineBasicMaterial({ linewidth: 1, color: dxfObj.color });

        const line = new THREE.Line( geometry, material );
        return line;
    }

    private _createArc( dxfObj: IDxfParsedObj ): THREE.Object3D {  
        const geometry = new THREE.BufferGeometry().setFromPoints( dxfObj.points );
        geometry.rotateX( Math.PI / -2 );

        const material = new THREE.LineBasicMaterial({ color: dxfObj.color });

        const arc = new THREE.Line(geometry, material);
        arc.position.x = dxfObj.origin.x;
        arc.position.y = dxfObj.origin.y;
        arc.position.z = dxfObj.origin.z;

        return arc;
    }

    private _createCircle( dxfObj: IDxfParsedObj ): THREE.Object3D {
        const geometry = new THREE.BufferGeometry().setFromPoints( dxfObj.points );
        geometry.rotateX( Math.PI / -2 );

        const material = new THREE.LineBasicMaterial({ color: dxfObj.color });

        const arc = new THREE.Line(geometry, material);
        arc.position.x = dxfObj.origin.x;
        arc.position.y = dxfObj.origin.y;
        arc.position.z = dxfObj.origin.z;

        return arc;
    }

    private _createEllipse( dxfObj: IDxfParsedObj ): THREE.Object3D{
        const geometry = new THREE.BufferGeometry().setFromPoints( dxfObj.points );
        geometry.rotateX( Math.PI / -2 );

        const material = new THREE.LineBasicMaterial({ linewidth: 1, color: dxfObj.color });

        // Create the final object to add to the scene
        const ellipse = new THREE.Line(geometry, material);
        return ellipse;
    }

    private _createSpline( dxfObj: IDxfParsedObj ): THREE.Object3D {
        const geometry = new THREE.BufferGeometry().setFromPoints( dxfObj.points );
        this._rotateBG90( geometry );

        const material = new THREE.LineBasicMaterial({ linewidth: 1, color: dxfObj.color });
        const spline = new THREE.Line( geometry, material );


        return spline;
    }

    private _createPoint( dxfObj: IDxfParsedObj ): THREE.Object3D {
        const p = dxfObj.points[0];
        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute([ p.x, p.z, p.y ], 3 ));
        
        const material = new THREE.PointsMaterial({ size: 0.1, color: dxfObj.color });
        const point = new THREE.Points( geometry, material );
        // const csObj = new CSObject( CSObjectType.POINT, point );
        return point;
    }

    private _rotateBG90( bufferGeometry: THREE.BufferGeometry ){
        bufferGeometry.rotateX( Math.PI / -2 );
    }
}