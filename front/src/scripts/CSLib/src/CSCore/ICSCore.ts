import * as THREE from 'three';
import type { IDxf } from "dxf-parser";
import type { CAMERA_TYPE } from "../CSCameraControls";
import type { CSDXFObject, ICSDXFObject } from '../CSObjects';
import type { IEventEmitter } from '../EventEmitter';
import type { ICSBorderObject, ICSBorderObjectConstructorOpts } from '../CSObjects/CSBorderObject';
import type { IStrapi } from '@/types/strapi';
import type { IPlayground, IPlaygroundFull } from '@/types/IReestr';

export enum CSMode { SELECT, EDIT };

export interface ICSCore extends IEventEmitter<CSCoreEvent> {
    Mode: CSMode;
    Bbox: THREE.Box3;
    HasBorders: boolean;
    resize( width: number, height: number ): void;
    switchCamera( type: CAMERA_TYPE ): void;
    recenterCamera(): void;
    setBackgroundColor( hex: string ): void;
    drawDxf( dxf: IDxf ): void;
    clearDxf(): void;
    setMode( mode: CSMode ): void;
    setTransformMode( mode: 'translate' | 'rotate' ): void;
    removeDxfObject( ...object: CSDXFObject[] ): void;
    selectByLayers( layersArr: string[] ): void;
    deselectAll(): void;
    deselectByLayers( layersArr: string[] ): void;
    drawBorders( playground: IStrapi<IPlaygroundFull> ): void;
    removeBorders(): void;
    CSDXFObjectsArr: ICSDXFObject[];
}

export enum CSEvent {
    DXF_OBJ_SELECT = 'CSEvent.DXF_OBJ_SELECT',
    DXF_OBJ_DESELECT = 'CSEvent.DXF_OBJ_DESELECT',
    DXF_OBJ_DESELECT_ALL = 'CSEvent.DXF_OBJ_DESELECT_ALL',
    DXF_OBJ_TRANSFORM_UPDATE = 'CSEvent.DXF_OBJ_TRANSFORM_UPDATE',
    DXF_OBJ_UPDATED = 'CSEvent.DXF_OBJ_UPDATED',
}

export interface CSCoreEvent {
    [CSEvent.DXF_OBJ_SELECT]: ICSDXFObject;
    [CSEvent.DXF_OBJ_DESELECT]: ICSDXFObject;
    [CSEvent.DXF_OBJ_DESELECT_ALL]: null;
    [CSEvent.DXF_OBJ_TRANSFORM_UPDATE]: ICSDXFObject;
    [CSEvent.DXF_OBJ_UPDATED]: ICSDXFObject;
}