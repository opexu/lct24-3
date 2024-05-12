import type { IDated, IManyRelation, IOneRelation, IStrapi, IUpload } from "@/types/strapi";
import type { ISAFCommon } from "./ISAFCommon";

// STRAPI TYPES
export type ISAFModelWithGeoTex = IStrapi<ISAFModel & IOneRelation<'geometry', ISAFGeometry> & IManyRelation<'texture', ISAFTexture>>

// RAW TYPES
export interface ISAFModel extends ISAFCommon {}

export interface ISAFGeometry extends IUpload, IDated {}

export interface ISAFTexture extends IUpload, IDated {
    formats?: { thumbnail: IThumbnail };
    height: number;
    width: number;
    previewUrl?: any;
}

export interface IThumbnail extends IUpload {
    height: number;
    width: number;
    path?: string;
    sizeInBytes: number;
}