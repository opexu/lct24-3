import { Polygon } from 'detect-collisions';
import type { ICSObject } from '../CSObjects';

export class CSPolygon extends Polygon {
        
    constructor( 
        private readonly _id: number,
        private readonly _parent?: ICSObject,
        ...args: ConstructorParameters<typeof Polygon>
    ){
        super( ...args );
    }

    get ID(){ return this._id; }
    get CSObject(){ return this._parent; }
}