import type { CAMERA_TYPE, ICSCameraControls } from "../CSCameraControls";

export interface ICSCore {
    resize( width: number, height: number ): void;
    switchCamera( type: CAMERA_TYPE ): void;
}