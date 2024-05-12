import type { CSDXFObject } from "../CSObjects";
import type { ICSObjectCache } from "./ICSObjectCache";

export class CSObjectCache implements ICSObjectCache {
    
    private readonly _map: Map<number, CSDXFObject> = new Map();
    
    constructor(){
        
    }
    
    get Map(){ return this._map; }
    get CSDXFObjectArr(){ return Array.from( this._map.values() ) }

    public add( csDxfObject: CSDXFObject ): void {
        if( this._map.has( csDxfObject.ID ) ){
            // TODO dispose
        }

        this._map.set( csDxfObject.ID, csDxfObject );
    }
    
    public remove( csDxfObject: CSDXFObject ): void {
        // dispose on level up
        this._map.delete( csDxfObject.ID );
    }
    
    public get( id: number ): CSDXFObject | undefined {
        return this._map.get( id );
    }

    public has( id: number ): boolean {
        return this._map.has( id );
    }

    public clear(){
        this._map.clear();
    }
}