import * as THREE from 'three';
import { EngineTypesArr, CSDXFObjectType, CSEngineType, type DXFObjectEvent, type ICSDXFObject, type ICSDXFObjectConstructorOpts } from '.';
import { CSDXFObjectEvent } from '.';
import { EventEmitter } from '../../EventEmitter/EventEmitter';
import * as CSUtils from '../../CSUtils';
import * as CSBuilder from '../../CSUtils/CSBuilder/CSBuilder';

export class CSDXFObject extends EventEmitter<DXFObjectEvent> implements ICSDXFObject {
    
    private _isSelected: boolean;
    private readonly _IS_CLOSED = true;

    private readonly _points: THREE.Vector3[];

    private readonly _type: CSDXFObjectType;
    private _engineType: CSEngineType;
    private _availableEngineTypes: CSEngineType[];
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

        this._availableEngineTypes = this._calcAvailableEngineTypes( this._type, this._IS_CLOSED );
        this._engineType = this._defaultEngineType( this._type, this._IS_CLOSED );
    }

    get ID(){ return this._raycastObject3D.id; }
    get DXFLayer(){ return this._dxfLayer; }
    get Type(){ return this._type; }
    get EngineType(){ return this._engineType; }
    get AvailableEngineTypes(){ return this._availableEngineTypes; }
    get Object2D(){ return this._object3D; }
    get RaycastObject2D(){ return this._raycastObject3D; }
    get IsSelected(){ return this._isSelected; }
    get IsClosed(){ return true; }
    get CanRotate(){ return this._type === CSDXFObjectType.POINT ? false : true }
    get GeoProps(){
        const size = new THREE.Vector3();
        this._object3D.geometry.boundingBox?.getSize( size );
        return {
            id: this.ID,
            origin: this._object3D.position,
            angle: THREE.MathUtils.radToDeg( this._object3D.rotation.y ),
            width: size.x,
            length: size.z,
            layer: this._dxfLayer,
            type: this._type,
            engineType: this._engineType,
        }
    }
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

    private _calcAvailableEngineTypes( type: CSDXFObjectType, isClosed: boolean ){
        switch( type ){
            case CSDXFObjectType.POLYLINE:
            case CSDXFObjectType.LWPOLYLINE:
            case CSDXFObjectType.ELLIPSE:
            case CSDXFObjectType.SPLINE:
            case CSDXFObjectType.ARC:
            case CSDXFObjectType.CIRCLE: {
                return isClosed ? EngineTypesArr : [ CSEngineType.POINT, CSEngineType.LINE ]
            }
            case CSDXFObjectType.LINE: return [ CSEngineType.LINE ];
            case CSDXFObjectType.POINT: return [ CSEngineType.POINT ];
        }
    }

    private _defaultEngineType( type: CSDXFObjectType, isClosed: boolean ){
        switch( type ){
            case CSDXFObjectType.POLYLINE:
            case CSDXFObjectType.LWPOLYLINE:
            case CSDXFObjectType.ELLIPSE:
            case CSDXFObjectType.SPLINE:
            case CSDXFObjectType.ARC:
            case CSDXFObjectType.CIRCLE: {
                return isClosed ? CSEngineType.REGION : CSEngineType.LINE;
            }
            case CSDXFObjectType.LINE: return CSEngineType.LINE;
            case CSDXFObjectType.POINT: return CSEngineType.POINT;
        }
    }

    public assignEngineType( engineType: CSEngineType ): void {
        if( engineType === this._engineType ) return;
        if( !this._availableEngineTypes.includes( engineType ) ) return;
        this._engineType = engineType;
        this.emit( CSDXFObjectEvent.UPDATED, this );
    }
}