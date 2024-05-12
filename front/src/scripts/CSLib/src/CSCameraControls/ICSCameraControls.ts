import * as THREE from 'three';
import type { MapControls } from 'three/examples/jsm/controls/MapControls';
import type { IEventEmitter } from '../EventEmitter';

export enum CAMERA_TYPE {
    PERSPECTIVE,
    ORTHOGRAPHIC
};

export type AnyCamera = THREE.PerspectiveCamera | THREE.OrthographicCamera;

export interface ICSCameraControls extends IEventEmitter<CSCameraEvent> {
    Cameras: (THREE.PerspectiveCamera | THREE.OrthographicCamera)[];
    Camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    Controls: MapControls;
    switchCamera( type: CAMERA_TYPE ): void;
    resize( width: number, height: number ): void;
    recenter( bbox: THREE.Box3 ): void;
}

export enum CSCameraEventKey {
    CAMERA_CHANGED = 'CSCameraEvent.CAMERA_CHANGED',
}

export interface CSCameraEvent {
    [CSCameraEventKey.CAMERA_CHANGED]: AnyCamera;
}