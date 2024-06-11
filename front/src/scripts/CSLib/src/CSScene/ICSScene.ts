import * as THREE from 'three';
import type { CSDXFObject } from '../CSObjects/CSDXFObject/CSDXFObject';
import type { CSBorderObject } from '../CSObjects/CSBorderObject';

export interface ICSScene extends THREE.Scene {
    Group2D: THREE.Group;
    BorderGroup: THREE.Group;
    RaycastGroup2D: THREE.Group;
    RaycastGroup3D: THREE.Group;
    addDxfObject( ...object: CSDXFObject[] ): void;
    removeDxfObject( ...object: CSDXFObject[] ): void;
    addBorderObject( ...object: CSBorderObject[] ): void;
    removeBorderObject( ...object: CSBorderObject[] ): void;
}