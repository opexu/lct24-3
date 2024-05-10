import * as THREE from 'three';
import type { ICSAttributes } from './ICSAttributes';

export interface ICSObject<T extends CSObjectType> {
    Type: T;
    Object3D: CSObjectMap[T];
    Helper: THREE.Object3D;
}

export interface ICSData {
    type: CSObjectType;
    attributes: ICSAttributes;
}

export enum CSObjectType {
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

export interface CSObjectMap {
    [CSObjectType.POLYLINE]: THREE.Line;
    [CSObjectType.LWPOLYLINE]: THREE.Line;
    [CSObjectType.LINE]: THREE.Line;
    [CSObjectType.ARC]: THREE.Line;
    [CSObjectType.CIRCLE]: THREE.Line;
    [CSObjectType.ELLIPSE]: THREE.Line;
    [CSObjectType.SPLINE]: THREE.Line;
    [CSObjectType.POINT]: THREE.Points;
}