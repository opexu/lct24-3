import * as THREE from 'three';
import { Polygon } from 'detect-collisions';
import type { IPlaygroundFull, ISerializableObj } from "@/types/IReestr";
import type { IStrapi } from "@/types/strapi";
import type { Path, Object3D, Object3DEventMap } from "three";
import type { ICSBorderObject, ICSBorderObjectConstructorOpts } from "./ICSBorderObject";
import * as CSBuilder from '../../CSUtils/CSBuilder/CSBuilder';
import { CSPolygon } from '../../CSCollision/CSPolygon';

export class CSBorderObject implements ICSBorderObject {
    
    private _isSelected: boolean;
    private readonly _points: THREE.Vector3[];
    private readonly _object3D: THREE.Line;
    private readonly _raycastObject3D: THREE.Mesh;
    private readonly _playground: IStrapi<IPlaygroundFull>;
    private readonly _polygon: CSPolygon;

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
        
        this._object3D.add( this._raycastObject3D );
        this._object3D.position.set( origin.x, origin.y, origin.z );

        // console.log('border origin', origin.x, origin.y, origin.z );
        // console.log('border points', this._points );
        // this._polygon = new Polygon({ x: 0, y: 0 }, this._points.map( p => ({ x: p.x, y: p.z })), { isStatic: true });
        this._polygon = new CSPolygon( this._raycastObject3D.id, undefined, { x: 0, y: 0 }, this._points.map( p => ({ x: p.x, y: p.z })), { isStatic: true });

        this._isSelected = false;
    }

    get ID(){ return this._raycastObject3D.id; }
    get Playground(){ return this._playground; }
    get Object2D(){ return this._object3D; }
    get IsSelected(){ return this._isSelected; }
    get Polygon(){ return this._polygon; }
    get IsCollide(){ return false; }
    
    private _create( points: THREE.Vector3[], color: number ){
        return CSBuilder.PolylineRaycast( points, color, { radius: 40 })
    }

    public serialize( parent: THREE.Object3D ): ISerializableObj {
        const points: { x: number, y: number }[] = [];
        const positionAttribute = this._object3D.geometry.getAttribute('position');
        for( let i = 0; i < positionAttribute.count; i++ ){
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute( positionAttribute, i );
            this._object3D.localToWorld( vertex );
            parent.worldToLocal( vertex );
            points.push({ x: vertex.x, y: vertex.z });
        }

        return {
            id: this.ID,
            points,
        }
    }
}