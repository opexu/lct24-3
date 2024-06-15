import type { ICSObject } from "../CSObjects";
import type { ICSObjectCache } from "./ICSObjectCache";

export class CSObjectCache<T extends ICSObject> implements ICSObjectCache<T> {
    
    private readonly _map: Map<number, T> = new Map();
        
    get Map(){ return this._map; }
    get CSObjectArr(){ return Array.from( this._map.values() ) }
    get HasSelected(){
        let hasSelected = false;
        this._map.forEach( csDxfObj => {
            if( csDxfObj.IsSelected ) hasSelected = true;
        });
        return hasSelected;
    }
    get Selected(){
        const selected: T[] = [];
        this._map.forEach( csobj => {
            if( csobj.IsSelected ) selected.push( csobj );
        });
        return selected;
    }

    public add( csobj: T ): void {
        if( this._map.has( csobj.ID ) ){
            // TODO dispose
        }

        this._map.set( csobj.ID, csobj );
    }
    
    public remove( csobj: T ): void {
        // dispose on level up
        this._map.delete( csobj.ID );
    }
    
    public get( id: number ): T | undefined {
        return this._map.get( id );
    }

    public has( id: number ): boolean {
        return this._map.has( id );
    }

    public clear(){
        this._map.clear();
    }
}