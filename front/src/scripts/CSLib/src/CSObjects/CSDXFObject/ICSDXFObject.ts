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
}

export interface ICSDXFObject extends IEventable<DXFObjectEvent> {
    ID: number;
    DXFLayer: string;
    Type: CSDXFObjectType;
    Object2D: THREE.Object3D;
    RaycastObject2D: THREE.Object3D;
    IsSelected: boolean;
    CanRotate: boolean;
    GeoProps: ICSGeoProps;
    select(): void;
    deselect(): void;
    dispose(): void;
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

export enum CSLineType { NORMAL, DASHED }

export enum CSDXFObjectEvent {
    SELECT = 'CSDXFObjectEvent.SELECT',
    DESELECT = 'CSDXFObjectEvent.DESELECT',
}

export interface DXFObjectEvent {
    [CSDXFObjectEvent.SELECT]: ICSDXFObject;
    [CSDXFObjectEvent.DESELECT]: ICSDXFObject;
}