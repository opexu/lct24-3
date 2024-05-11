import type { ICSScene } from "./ICSScene";
import * as THREE from 'three';
import { InfiniteGridHelper } from "./InfiniteGridHelper";
import type { CSDXFObject } from "../CSObjects/CSDXFObject/CSDXFObject";
import type { CSDXFObjectType } from "../CSObjects/CSDXFObject/ICSDXFObject";

export class CSScene extends THREE.Scene implements ICSScene {

    private readonly _group2D: THREE.Group;
    private readonly _group3D: THREE.Group;
    private readonly _raycastGroup2D: THREE.Group;
    private readonly _raycastGroup3D: THREE.Group;

    constructor(){
        super();

        this.background = new THREE.Color( '#262626' );
        const axesHelper = new THREE.AxesHelper( 10 );
        this.add( axesHelper );

        const gridHelper = new InfiniteGridHelper( 10, 100, new THREE.Color('#111111') );
        this.add( gridHelper );

        this._group2D = new THREE.Group();
        this._group3D = new THREE.Group();
        this._raycastGroup2D = new THREE.Group();
        this._raycastGroup3D = new THREE.Group();

        this.add( this._group2D, this._group3D, this._raycastGroup2D, this._raycastGroup3D );
    }

    get RaycastGroup2D(){ return this._raycastGroup2D; }
    get RaycastGroup3D(){ return this._raycastGroup3D; }

    public addDxfObject( ...object: CSDXFObject[] ): void {
        this._group2D.add( ...object.map( o => o.Object2D ) );
        this._raycastGroup2D.add( ...object.map( o => o.RaycastObject2D ) );

        
    }

    public removeDxfObject( ...object: CSDXFObject[] ): void {
        this._group2D.remove( ...object.map( o => o.Object2D ) );
        this._raycastGroup2D.remove( ...object.map( o => o.RaycastObject2D ) );
    }
}