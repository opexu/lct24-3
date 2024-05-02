import * as THREE from 'three';
import type { MapControls } from 'three/examples/jsm/controls/MapControls';

export enum CAMERA_TYPE {
    PERSPECTIVE,
    ORTHOGRAPHIC
};

export interface ICSCameraControls {
    Cameras: (THREE.PerspectiveCamera | THREE.OrthographicCamera)[];
    Camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    Controls: MapControls;
    switchCamera( type: CAMERA_TYPE ): void;
    resize( width: number, height: number ): void;
}