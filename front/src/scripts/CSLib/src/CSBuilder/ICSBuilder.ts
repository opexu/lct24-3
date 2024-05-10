import * as THREE from 'three';
import type { IDxf } from "dxf-parser";
import type { CSObjectType, ICSObject } from "../CSObjects/ICSObject";
import type { IDxfParsedObj } from "../CSUtils/CSDXFParser";
import type { CSObject } from '../CSObjects/CSObject';

export interface ICSBuilder {
    create<T extends CSObjectType>( dxfObj: IDxfParsedObj ): CSObject<T>;
    createRaw( dxfObj: IDxfParsedObj ): THREE.Object3D;
}