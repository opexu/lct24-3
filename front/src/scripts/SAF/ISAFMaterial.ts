import type { IManyRelation, IStrapi } from "@/types/strapi";
import type { ISAFCommon } from "./ISAFCommon";

// STRAPI TYPES
export type ISAFMaterialWithColors = IStrapi<ISAFMaterial & IManyRelation<'colors', IStrapi<ISAFColor>[]>>;

// RAW TYPES
export interface ISAFMaterial extends ISAFCommon {
    Title: string;
    Code: string;
}

export interface ISAFColor extends ISAFCommon {
    HEX: string;
    RAL: string;
    RGB: ISAFRGB;
}

export interface ISAFRGB {
    R: number;
    G: number;
    B: number;
}