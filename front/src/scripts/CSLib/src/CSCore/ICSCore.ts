import * as THREE from 'three';
import type { IDxf } from "dxf-parser";
import type { CAMERA_TYPE } from "../CSCameraControls";
import type { CSDXFObject, ICSDXFObject } from '../CSObjects';
import type { IEventEmitter } from '../EventEmitter';

export enum CSMode { DXF, EDIT };

export interface ICSCore extends IEventEmitter<CSCoreEvent> {
    Mode: CSMode;
    Bbox: THREE.Box3;
    resize( width: number, height: number ): void;
    switchCamera( type: CAMERA_TYPE ): void;
    recenterCamera(): void;
    setBackgroundColor( hex: string ): void;
    drawDxf( dxf: IDxf ): void;
    clearDxf(): void;
    setMode( mode: CSMode ): boolean;
    removeDxfObject( ...object: CSDXFObject[] ): void;
}

export enum CSEvent {
    DXF_OBJ_SELECT = 'CSEvent.DXF_OBJ_SELECT',
    DXF_OBJ_DESELECT = 'CSEvent.DXF_OBJ_DESELECT',
}

export interface CSCoreEvent {
    [CSEvent.DXF_OBJ_SELECT]: ICSDXFObject;
    [CSEvent.DXF_OBJ_DESELECT]: ICSDXFObject;
}