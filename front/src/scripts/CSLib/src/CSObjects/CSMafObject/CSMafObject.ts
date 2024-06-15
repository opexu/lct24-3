import * as THREE from 'three';
import { Polygon } from 'detect-collisions';
import type { IDxfParsedMafObj, IMafFull } from "@/types/IReestr";
import { CSMafObjectEvent, type ICSMafObject, type ICSMafObjectConstructorOpts, type MafObjectEvent } from "./ICSMafObject";
import { EventEmitter } from '../../EventEmitter/EventEmitter';
import type { IStrapi } from "@/types/strapi";
import type { IPoint } from "dxf-parser";
import * as CSUtils from '../../CSUtils';
import * as CSBuilder from '../../CSUtils/CSBuilder/CSBuilder';
import { CSPolygon } from '../../CSCollision/CSPolygon';

export class CSMafObject extends EventEmitter<MafObjectEvent> implements ICSMafObject {
    
    private _isSelected: boolean;
    private _isCollide: boolean;
    private readonly _points: IPoint[];
    private readonly _id: number;
    private readonly _color: THREE.Color;
    private readonly _selectedColor: THREE.Color;
    private readonly _nonCollideColor: THREE.Color;
    private readonly _collideColor: THREE.Color;
    
    private readonly _object3D: THREE.Line | THREE.Mesh;
    private readonly _raycastObject3D: THREE.Mesh;
    private readonly _maf: IStrapi<IMafFull>;
    private readonly _geoMat: THREE.LineBasicMaterial;
    private readonly _borderMat: THREE.LineBasicMaterial;
    private readonly _polygon: CSPolygon;

    constructor(
        data: IDxfParsedMafObj,
        opts: ICSMafObjectConstructorOpts,
    ){
        super();

        this._points = data.borderPoints;
        this._maf = opts.maf;
        this._id = data.id;
        
        this._color = new THREE.Color( 0xffffff );
        this._selectedColor = new THREE.Color( 0xffff00 );

        this._nonCollideColor = new THREE.Color( 0x00ff00 );
        this._collideColor = new THREE.Color( 0xff0000 );

        const { origin, mesh, raycastObj, mat: _mat } = this._createRaycast( this._points, 0x00ff00 );
        this._borderMat = _mat;

        this._object3D = mesh;
        this._object3D.layers.set( 1 );
        this._object3D.name = this._maf.id.toString();
        this._raycastObject3D = raycastObj;
        this._raycastObject3D.layers.set( 2 );
        this._raycastObject3D.visible = false;
        this._raycastObject3D.userData = this;

        this._object3D.add( this._raycastObject3D );
        const { parentObj, mat } = this._createGeo( data.geoPoints, 0xffffff );
        this._geoMat = mat;
        this._object3D.add( parentObj );
        this._object3D.position.set( origin.x, origin.y, origin.z );
        
        // console.log('maf origin', origin.x, origin.y, origin.z );
        // console.log('maf points', this._points );
        // this._polygon = new Polygon({ x: origin.x, y: origin.z }, this._points.map( p => ({ x: p.x, y: p.z })), { isStatic: false });
        this._polygon = new CSPolygon( this._raycastObject3D.id, this, { x: origin.x, y: origin.z }, this._points.map( p => ({ x: p.x, y: p.z })), { isStatic: false });

        this._isSelected = false;
        this._isCollide = false;
    }

    get ID(){ return this._id; }
    get Maf(){ return this._maf; }
    get Object2D(){ return this._object3D; }
    get IsSelected(){ return this._isSelected; }
    get CanRotate(){ return true; }
    get IsMaf(){ return true; }
    get GeoProps(){
        const size = new THREE.Vector3();
        this._object3D.geometry.boundingBox?.getSize( size );
        return {
            id: this.ID,
            origin: this._object3D.position,
            radAngle: this._object3D.rotation.y,
            angle: THREE.MathUtils.radToDeg( this._object3D.rotation.y ),
            width: size.x,
            length: size.z,
        }
    }
    get Polygon(){ return this._polygon; }
    get IsCollide(){ return this._isCollide; }
    set IsCollide( value: boolean ){
        if( this._isCollide === value ) return;
        this._isCollide = value;
        this._borderMat.color = this._isCollide ? this._collideColor : this._nonCollideColor;
        this._borderMat.needsUpdate = true;
    }

    private _createRaycast( points: IPoint[], color: number ){
        const _points = points.map( p => new THREE.Vector3( p.x, 0, p.z ) );
        return CSBuilder.PolylineRaycast( _points, color, { radius: 10 } );
    }

    private _createGeo( points: IPoint[][], color: number ){
        const _points = points.map( pArr => pArr.map( p => new THREE.Vector3( p.x, 0, p.z ) ));
        return CSBuilder.PolylinesGroup( _points, color );
    }

    public select(){
        this._isSelected = true;
        this._geoMat.color = this._selectedColor;
        this._geoMat.needsUpdate = true;
        this.emit( CSMafObjectEvent.SELECT, this );
    }

    public deselect(){
        this._isSelected = false;
        this._geoMat.color = this._color;
        this._geoMat.needsUpdate = true;
        this.emit( CSMafObjectEvent.DESELECT, this );
    }

    public dispose(): void {
        super.dispose();
        this._object3D.traverse( o => {
            if( CSUtils.IsMesh( o ) ) {
                CSUtils.DisposeMaterial( o.material );
                o.geometry.dispose();
            }
        });
    }
}