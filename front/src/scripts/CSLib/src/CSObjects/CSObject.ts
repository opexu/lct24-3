import * as THREE from 'three';
import type { CSObjectMap, CSObjectType, ICSObject } from "./ICSObject";

export class CSObject<T extends CSObjectType> implements ICSObject<T> {
    
    private readonly _type: T;
    private readonly _object3D: CSObjectMap[T];
    private readonly _helper: THREE.Object3D;

    constructor(
        type: T,
        object3D: CSObjectMap[T],
    ){
        this._object3D = object3D;
        this._type = type;
        this._helper = new THREE.Mesh();

    }
    get Type(){ return this._type; }
    get Object3D(){ return this._object3D; }
    get Helper(){ return this._helper; }
}