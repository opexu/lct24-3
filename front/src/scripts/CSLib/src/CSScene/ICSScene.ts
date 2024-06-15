import * as THREE from 'three';
import type { CSBorderObject } from '../CSObjects/CSBorderObject';
import type { CSObject, ICSObject } from '../CSObjects';

export interface ICSScene extends THREE.Scene {
    Group2D: THREE.Group;
    BorderGroup: THREE.Group;
    // RaycastGroup2D: THREE.Group;
    // RaycastGroup3D: THREE.Group;
    addCSObject( ...object: ICSObject[] ): void;
    removeCSObject( ...object: ICSObject[] ): void;
    addBorderObject( ...object: CSBorderObject[] ): void;
    removeBorderObject( ...object: CSBorderObject[] ): void;
}