import * as THREE from 'three';
import type { CSDXFObjectType, DXFObjectEvent, ICSDXFObject } from '.';
import { CSDXFObjectEvent } from '.';
import { EventEmitter } from '../../EventEmitter/EventEmitter';

export class CSDXFObject extends EventEmitter<DXFObjectEvent> implements ICSDXFObject {
    
    private readonly _type: CSDXFObjectType;
    private readonly _object3D: THREE.Line | THREE.Mesh;
    private readonly _raycastObject3D: THREE.Mesh;

    constructor(
        type: CSDXFObjectType,
        object2D: THREE.Line | THREE.Mesh,
        raycastObject2D: THREE.Mesh,
    ){
        super();
        this._object3D = object2D;
        this._type = type;
        this._raycastObject3D = raycastObject2D;
        
        this._raycastObject3D.visible = false;
    }

    get ID(){ return this._raycastObject3D.id; }
    get Type(){ return this._type; }
    get Object2D(){ return this._object3D; }
    get RaycastObject2D(){ return this._raycastObject3D; }
    get IsSelected(){ return this._raycastObject3D.visible; }

    public select(){
        this._raycastObject3D.visible = true;
        this.emit( CSDXFObjectEvent.SELECT, this );
    }

    public deselect(){
        this._raycastObject3D.visible = false;
        this.emit( CSDXFObjectEvent.DESELECT, this );
    }

    public dispose(): void {
        super.dispose();
        if( Array.isArray( this._object3D.material )){
            this._object3D.material.forEach( m => m.dispose() );
        }else{
            this._object3D.material.dispose();
        }

        if( Array.isArray( this._raycastObject3D.material )){
            this._raycastObject3D.material.forEach( m => m.dispose() );
        }else{
            this._raycastObject3D.material.dispose();
        }
    }
}