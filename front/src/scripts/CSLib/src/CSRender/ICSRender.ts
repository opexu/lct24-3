import type * as THREE from "three";

export interface ICSRender {
    setCamera( camera: THREE.Camera ): void;
    render(): void;
    resize( width: number, height: number ): void;
}