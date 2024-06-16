import * as THREE from 'three';
import type { IEventable } from '../../EventEmitter';
import type { ICSSelectable, ICollidable, IDisposable, IGeoProps, ISerializable, IsMaf } from '../common';

export interface ICSDXFObjectConstructorOpts {
    color: number,
    type: CSDXFObjectType,
    layer: string,
}

// export interface ICSGeoProps {
//     id: number;
//     origin: THREE.Vector3;
//     angle: number;
//     width: number;
//     length: number;
//     layer: string;
//     type: CSDXFObjectType;
//     engineType: CSEngineType;
// }

export interface ICSDXFObject extends IEventable<CSDXFEvent>, ICSSelectable, IDisposable, IsMaf, IGeoProps, ICollidable, ISerializable {
    ID: number;
    DXFLayer: string;
    Type: CSDXFObjectType;
    EngineType: CSEngineType;
    AvailableEngineTypes: CSEngineType[];
    Object2D: THREE.Object3D;
    IsClosed: boolean;
    CanRotate: boolean;
    // GeoProps: ICSGeoProps;
    assignEngineType( engineType: CSEngineType ): void;
}

export enum CSDXFObjectType {
    POLYLINE = 'POLYLINE',
    LWPOLYLINE = 'LWPOLYLINE',
    LINE = 'LINE',
    ARC = 'ARC',
    CIRCLE = 'CIRCLE',
    ELLIPSE = 'ELLIPSE',
    SPLINE = 'SPLINE',
    POINT = 'POINT',
}

export enum CSEngineType {
    POINT = 'CSEngineType.POINT',
    REGION = 'CSEngineType.REGION',
    LINE = 'CSEngineType.LINE'
}
export const EngineTypesArr = [ CSEngineType.POINT, CSEngineType.REGION, CSEngineType.LINE ];

export enum CSLineType { NORMAL, DASHED }

export enum CSDXFObjectEvent {
    SELECT = 'CSDXFObjectEvent.SELECT',
    DESELECT = 'CSDXFObjectEvent.DESELECT',
    UPDATED = 'CSDXFObjectEvent.UPDATED',
}

export interface CSDXFEvent {
    [CSDXFObjectEvent.SELECT]: ICSDXFObject;
    [CSDXFObjectEvent.DESELECT]: ICSDXFObject;
    [CSDXFObjectEvent.UPDATED]: ICSDXFObject;
}