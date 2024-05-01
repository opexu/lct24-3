import type { ICSScene } from "./ICSScene";
import * as THREE from 'three';
import { InfiniteGridHelper } from "./InfiniteGridHelper";

export class CSScene extends THREE.Scene implements ICSScene{

    constructor(){
        super();

        this.background = new THREE.Color( '#262626' );
        const axesHelper = new THREE.AxesHelper( 10 );
        this.add( axesHelper );

        const gridHelper = new InfiniteGridHelper( 10, 100, new THREE.Color('#111111') );
        this.add( gridHelper );
    }
}