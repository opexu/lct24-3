import * as THREE from 'three';

export enum CSMaterialType {
    LINE_DASHED = 'LineDashed',
    LINE_BASIC = 'LineBasic',
}

export interface ICSMaterialMap {
    [CSMaterialType.LINE_DASHED]: THREE.LineDashedMaterial,
    [CSMaterialType.LINE_BASIC]: THREE.LineBasicMaterial,
}

export class CSMaterialManager {
    
    private readonly _map = new Map<CSMaterialType, ICSMaterialMap[CSMaterialType]>();

    constructor(){
    }

    getMaterial<T extends CSMaterialType>( type: T ): ICSMaterialMap[T] | undefined {
        return this._map.get( type ) as ICSMaterialMap[T] | undefined;
    }
}