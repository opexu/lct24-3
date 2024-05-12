import type { IDxf } from "dxf-parser";

export function getLayers( dxf: IDxf ){
    return Object.values( dxf.tables.layer.layers ).map(( layer ) => layer );
}

export function getLayersWithCount( dxf: IDxf ){
    return Object.values( dxf.tables.layer.layers ).map(( layer ) => ({ layer, count: getLayerCount( dxf, layer.name )}) );
}

export function getLayerEntities( dxf: IDxf, layer: string ){
    return dxf.entities.filter( e => e.layer === layer );
}
export function getLayerCount( dxf: IDxf, layer: string ){
    return getLayerEntities( dxf, layer ).length;
}