import * as THREE from 'three';
import { CSDXFObjectType, type DXFObjectEvent, type ICSDXFObject, type ICSDXFObjectConstructorOpts } from '.';
import { CSDXFObjectEvent } from '.';
import { EventEmitter } from '../../EventEmitter/EventEmitter';
import * as CSUtils from '../../CSUtils';
import * as CSBuilder from '../../CSUtils/CSBuilder/CSBuilder';

export class CSDXFObject extends EventEmitter<DXFObjectEvent> implements ICSDXFObject {
    
    private _isSelected: boolean;

    private readonly _points: THREE.Vector3[];

    private readonly _type: CSDXFObjectType;
    private readonly _dxfLayer: string;
    private readonly _color: THREE.Color;
    private readonly _selectedColor: THREE.Color;
    private readonly _object3D: THREE.Line | THREE.Mesh;
    private readonly _raycastObject3D: THREE.Mesh;

    constructor(
        // type: CSDXFObjectType,
        // dxfLayer: string,
        // object2D: THREE.Line | THREE.Mesh,
        // raycastObject2D: THREE.Mesh,
        points: THREE.Vector3[],
        opts: ICSDXFObjectConstructorOpts,
    ){
        super();

        this._points = points;
        this._type = opts.type;
        this._dxfLayer = opts.layer;
        this._color = new THREE.Color( opts.color );
        this._selectedColor = new THREE.Color( 0xffff00 );

        const { origin, mesh, raycastObj } = this._create( this._points, opts.color, this._type );
        this._object3D = mesh;
        this._object3D.layers.set( 1 );
        this._raycastObject3D = raycastObj;
        this._raycastObject3D.layers.set( 2 );

        this._raycastObject3D.visible = false;

        this._isSelected = false;
    }

    get ID(){ return this._raycastObject3D.id; }
    get DXFLayer(){ return this._dxfLayer; }
    get Type(){ return this._type; }
    get Object2D(){ return this._object3D; }
    get RaycastObject2D(){ return this._raycastObject3D; }
    get IsSelected(){ return this._isSelected; }

    public select(){
        this._isSelected = true;
        ( this._object3D.material as THREE.MeshBasicMaterial ).color = this._selectedColor;
        ( this._object3D.material as THREE.MeshBasicMaterial ).needsUpdate = true;
        this.emit( CSDXFObjectEvent.SELECT, this );
    }

    public deselect(){
        this._isSelected = false;
        ( this._object3D.material as THREE.MeshBasicMaterial ).color = this._color;
        ( this._object3D.material as THREE.MeshBasicMaterial ).needsUpdate = true;
        this.emit( CSDXFObjectEvent.DESELECT, this );
    }

    public dispose(): void {
        super.dispose();
        CSUtils.DisposeMaterial( this._object3D.material );
        CSUtils.DisposeMaterial( this._raycastObject3D.material );
        this._object3D.geometry.dispose();
        this._raycastObject3D.geometry.dispose();
    }

    private _create( points: THREE.Vector3[], color: number, type: CSDXFObjectType ){
        switch( type ){
            case CSDXFObjectType.POLYLINE:
            case CSDXFObjectType.LWPOLYLINE:
            case CSDXFObjectType.LINE: 
            case CSDXFObjectType.ELLIPSE:
            case CSDXFObjectType.SPLINE:
            case CSDXFObjectType.ARC:
            case CSDXFObjectType.CIRCLE: 
            {
                const opts = { radius: 40 }
                return CSBuilder.Polyline( points, color, opts );
            }
            case CSDXFObjectType.POINT: 
            {
                const opts = { radius: 40 }
                return CSBuilder.Point( points[0], color, opts );
            }
        }
    }
}