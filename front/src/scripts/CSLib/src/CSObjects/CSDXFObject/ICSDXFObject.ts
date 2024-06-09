import * as THREE from 'three';
import type { IEventable } from '../../EventEmitter';

export interface ICSDXFObjectConstructorOpts {
    color: number,
    type: CSDXFObjectType,
    layer: string,
}

export interface ICSGeoProps {
    id: number;
    origin: THREE.Vector3;
    angle: number;
    width: number;
    length: number;
    layer: string;
    type: CSDXFObjectType;
    engineType: CSEngineType;
}

export interface ICSDXFObject extends IEventable<DXFObjectEvent> {
    ID: number;
    DXFLayer: string;
    Type: CSDXFObjectType;
    EngineType: CSEngineType;
    AvailableEngineTypes: CSEngineType[];
    Object2D: THREE.Object3D;
    RaycastObject2D: THREE.Object3D;
    IsSelected: boolean;
    IsClosed: boolean;
    CanRotate: boolean;
    GeoProps: ICSGeoProps;
    select(): void;
    deselect(): void;
    dispose(): void;
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

export interface DXFObjectEvent {
    [CSDXFObjectEvent.SELECT]: ICSDXFObject;
    [CSDXFObjectEvent.DESELECT]: ICSDXFObject;
    [CSDXFObjectEvent.UPDATED]: ICSDXFObject;
}