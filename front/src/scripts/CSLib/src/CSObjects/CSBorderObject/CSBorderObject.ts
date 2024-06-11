import * as THREE from 'three';
import type { IPlaygroundFull } from "@/types/IReestr";
import type { IStrapi } from "@/types/strapi";
import type { Path, Object3D, Object3DEventMap } from "three";
import type { ICSBorderObject, ICSBorderObjectConstructorOpts } from "./ICSBorderObject";
import * as CSBuilder from '../../CSUtils/CSBuilder/CSBuilder';

export class CSBorderObject implements ICSBorderObject {
    
    private _isSelected: boolean;
    private readonly _points: THREE.Vector3[];
    private readonly _object3D: THREE.Line;
    private readonly _raycastObject3D: THREE.Mesh;
    private readonly _playground: IStrapi<IPlaygroundFull>;

    constructor(
        points: THREE.Vector3[],
        opts: ICSBorderObjectConstructorOpts,
    ){
        this._points = points;

        this._playground = opts.playground;

        const { origin, mesh, raycastObj } = this._create( this._points, 0xff0000 );
        this._object3D = mesh;
        this._object3D.layers.set( 1 );
        this._object3D.name = this._playground.id.toString();
        this._raycastObject3D = raycastObj;
        this._raycastObject3D.layers.set( 2 );
        this._raycastObject3D.visible = false;

        this._isSelected = false;
    }

    get ID(){ return this._raycastObject3D.id; }
    get IDName(){ return this._object3D.name; }
    get Playground(){ return this._playground; }
    get Object2D(){ return this._object3D; }
    get RaycastObject2D(){ return this._raycastObject3D; }
    get IsSelected(){ return this._isSelected; }

    private _create( points: THREE.Vector3[], color: number ){
        return CSBuilder.Polyline( points, color, { radius: 40 })
    }
}