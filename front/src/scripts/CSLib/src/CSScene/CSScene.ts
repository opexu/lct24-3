import type { ICSScene } from "./ICSScene";
import * as THREE from 'three';

export class CSScene extends THREE.Scene implements ICSScene{

    constructor(){
        super();

        this.background = new THREE.Color( '#262626' );
        const axesHelper = new THREE.AxesHelper( 10 );
        this.add( axesHelper );
    }
}