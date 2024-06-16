import * as THREE from 'three';
import * as COLLISION from 'detect-collisions';
import type { IPoint } from 'dxf-parser';
import type { CSObject, ICSObject, ICollidable } from '../CSObjects';
import type { ICSCollision } from './ICSCollision';
import type { CSPolygon } from './CSPolygon';

export class CSCollision implements ICSCollision {
    
    private readonly _system: COLLISION.System;
    private readonly _colliders: Map<number, ICSObject>;
    constructor(){
        this._system = new COLLISION.System();
        this._colliders = new Map();
    }

    public add( csobj: ICollidable ){
        this._system.insert( csobj.Polygon );
        if( csobj.Polygon.CSObject && !this._colliders.has( csobj.Polygon.CSObject.ID )){
            this._colliders.set( csobj.Polygon.CSObject.ID, csobj.Polygon.CSObject );
        }
        this._check();
    }

    public remove( csobj: ICollidable ){
        this._system.remove( csobj.Polygon );
        if( csobj.Polygon.CSObject ) this._colliders.delete( csobj.Polygon.CSObject.ID );
        this._check();
    }

    public update( csobj: ICSObject ): void {
        const polygon = csobj.Polygon;
        const geoProps = csobj.GeoProps;
        polygon.setPosition( geoProps.origin.x, geoProps.origin.z );
        polygon.setAngle( -geoProps.radAngle );
        this._check();
    }

    private _check(){
        this._system.update();
        const idAASet = new Set();
        const idBoundsSet = new Set();
        if( !this._system.checkAll( res => {
            const csA = (res.a as CSPolygon).CSObject;
            const csB = (res.b as CSPolygon).CSObject;
            if( (csA && !csB) || (!csA && csB) ){
                const cs = (csA && !csB) ? csA : (!csA && csB) ? csB : undefined;
                if( cs && ( res.aInB || res.bInA )) {
                    cs.IsCollide = true;
                    idBoundsSet.add( cs.ID );
                }
            }

            if( csA && csB ) {
                csA.IsCollide = true;
                csB.IsCollide = true;
                idAASet.add( csA.ID );
                idAASet.add( csB.ID );
            }
        }) ){
            this._colliders.forEach(( csobj, id ) => {
                if( !idAASet.has( id ) ){
                    if( idBoundsSet.has( id ) ) csobj.IsCollide = false;
                    else csobj.IsCollide = true;
                }
            })
            return;
        }
    }
}