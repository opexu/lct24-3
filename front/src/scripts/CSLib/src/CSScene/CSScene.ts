import type { ICSScene } from "./ICSScene";
import * as THREE from 'three';
import { InfiniteGridHelper } from "./InfiniteGridHelper";
import type { CSObject } from "../CSObjects/CSObject";
import type { CSObjectType } from "../CSObjects/ICSObject";

export class CSScene extends THREE.Scene implements ICSScene {

    private readonly _group2D: THREE.Group;
    private readonly _group3D: THREE.Group;

    constructor(){
        super();

        this.background = new THREE.Color( '#262626' );
        const axesHelper = new THREE.AxesHelper( 10 );
        this.add( axesHelper );

        const gridHelper = new InfiniteGridHelper( 10, 100, new THREE.Color('#111111') );
        this.add( gridHelper );

        this._group2D = new THREE.Group();
        this._group3D = new THREE.Group();

        this.add( this._group2D, this._group3D );
    }

    public add2D( ...object: THREE.Object3D[] ){
        this._group2D.add( ...object );
    }

    public add3D( ...object: THREE.Object3D[] ){
        this._group3D.add( ...object );
    }
    
    public addCS<T extends CSObjectType>( ...object: CSObject<T>[] ): void {
       
    }
}