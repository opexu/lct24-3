import type { ICSScene } from "./ICSScene";
import * as THREE from 'three';
import { InfiniteGridHelper } from "./InfiniteGridHelper";
import * as CSUtils from '../CSUtils';
import type { CSBorderObject } from "../CSObjects/CSBorderObject";
import type { CSObject, ICSObject } from "../CSObjects";

export class CSScene extends THREE.Scene implements ICSScene {

    private readonly _group2D: THREE.Group;
    private readonly _borderGroup: THREE.Group;
    private readonly _helperGroup: THREE.Group;

    constructor(){
        super();

        this.background = new THREE.Color( '#262626' );
        const axesHelper = new THREE.AxesHelper( 100 );
        this.add( axesHelper );

        const gridHelper = new InfiniteGridHelper( 10, 100, new THREE.Color('#111111') );
        this.add( gridHelper );

        this._group2D = new THREE.Group();
        this._borderGroup = new THREE.Group();
        this._helperGroup = new THREE.Group();

        this.add( this._group2D, this._borderGroup, this._helperGroup );
    }

    get Group2D(){ return this._group2D; }
    get BorderGroup(){ return this._borderGroup; }
    // get RaycastGroup2D(){ return this._raycastGroup2D; }
    // get RaycastGroup3D(){ return this._raycastGroup3D; }

    public addCSObject( ...object: ICSObject[] ): void {
        this._group2D.add( ...object.map( o => o.Object2D ) );
    }

    public removeCSObject( ...object: ICSObject[] ): void {
        this._group2D.remove( ...object.map( o => o.Object2D ) );

        this._removeHelper();
    }

    public addBorderObject( ...object: CSBorderObject[] ): void {
        this._borderGroup.add( ...object.map( o => o.Object2D ) );
    }

    public removeBorderObject( ...object: CSBorderObject[] ): void {
        this._borderGroup.remove( ...object.map( o => o.Object2D ) );

        this._removeHelper();
    }

    private _addHelper( ...box: THREE.Box3[] ){
        this._helperGroup.add( ...box.map( b => new THREE.Box3Helper( b, 0xffff00 ) ));
    }

    private _removeHelper(){
        (this._helperGroup.children as THREE.Box3Helper[]).forEach( b => {
            b.geometry.dispose();
            CSUtils.DisposeMaterial( b.material );
        });

    }
}