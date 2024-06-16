import * as THREE from 'three';
import type { IDxf } from "dxf-parser";
import type { CAMERA_TYPE } from "../CSCameraControls";
import type { CSMafObject, ICSDXFObject, ICSMafObject, ICSObject } from '../CSObjects';
import type { IEventEmitter } from '../EventEmitter';
import type { ICSBorderObject, ICSBorderObjectConstructorOpts } from '../CSObjects/CSBorderObject';
import type { IStrapi } from '@/types/strapi';
import type { IDxfParsedMafObj, IMafFull, IPlayground, IPlaygroundFull, ISceneGraph } from '@/types/IReestr';

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
    removeDxfObject( ...object: CSMafObject[] ): void;
    selectByLayers( layersArr: string[] ): void;
    deselectAll(): void;
    deselectByLayers( layersArr: string[] ): void;
    drawBorders( playground: IStrapi<IPlaygroundFull> ): void;
    removeBorders(): void;
    drawMaf( parsedMafGeo: IDxfParsedMafObj, mafInfo: IStrapi<IMafFull> ): void;
    removeMaf( id: number ): void;
    buildSceneGraph(): ISceneGraph | null;
    CSObjectsArr: ICSObject[];
}

export enum CSEvent {
    SELECT = 'CSEvent.SELECT',
    DESELECT = 'CSEvent.DESELECT',
    DESELECT_ALL = 'CSEvent.DESELECT_ALL',
    TRANSFORM_UPDATE = 'CSEvent.TRANSFORM_UPDATE',
    UPDATED = 'CSEvent.UPDATED',
}

export interface CSCoreEvent {
    [CSEvent.SELECT]: ICSObject;
    [CSEvent.DESELECT]: ICSObject;
    [CSEvent.DESELECT_ALL]: null;
    [CSEvent.TRANSFORM_UPDATE]: ICSObject;
    [CSEvent.UPDATED]: ICSObject;
}