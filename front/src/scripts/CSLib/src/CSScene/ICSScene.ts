import * as THREE from 'three';
import type { CSDXFObject } from '../CSObjects/CSDXFObject/CSDXFObject';

export interface ICSScene extends THREE.Scene {
    RaycastGroup2D: THREE.Group;
    RaycastGroup3D: THREE.Group;
    addDxfObject( ...object: CSDXFObject[] ): void;
    removeDxfObject( ...object: CSDXFObject[] ): void;
}