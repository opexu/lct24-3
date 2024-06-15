import * as THREE from 'three';
import { Polygon } from 'detect-collisions';
import type { CSDXFObject, ICSDXFObject } from './CSDXFObject';
import type { CSMafObject, ICSMafObject } from './CSMafObject';
import type { CSPolygon } from '../CSCollision/CSPolygon';

export type CSObject = CSDXFObject | CSMafObject;
export type ICSObject = ICSDXFObject | ICSMafObject;

export interface IGeoProps { GeoProps: ICSGeoProps; }

export interface ICSSelectable {
    IsSelected: boolean;
    select(): void;
    deselect(): void;
}

export interface IDisposable {
    dispose(): void;
}

export interface IsMaf {
    IsMaf: boolean;
}

export interface ICSGeoProps {
    id: number;
    origin: THREE.Vector3;
    radAngle: number;
    angle: number;
    width: number;
    length: number;
}

export interface ICollidable {
    Polygon: CSPolygon;
    IsCollide: boolean;
}

export function IsMaf( obj: ICSObject ): obj is ICSMafObject { return obj.IsMaf; }

export class CSLine extends THREE.Line {

    constructor(
        private readonly csobj: ICSObject,
        ...args: ConstructorParameters<typeof THREE.Line>
    ){
        super( ...args );
    }

    get CSObject(){ return this.csobj; }
}