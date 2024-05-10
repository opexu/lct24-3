import * as THREE from 'three';
import type { CSObject } from '../CSObjects/CSObject';
import type { CSObjectType } from '../CSObjects/ICSObject';

export interface ICSScene extends THREE.Scene {
    add2D( ...object: THREE.Object3D[] ): void;
    add3D( ...object: THREE.Object3D[] ): void;
    addCS<T extends CSObjectType>( ...object: CSObject<T>[] ): void;
}