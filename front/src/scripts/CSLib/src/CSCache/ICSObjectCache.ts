import type { CSDXFObject } from "../CSObjects";

export interface ICSObjectCache {
    Map: Map<number, CSDXFObject>;
    CSDXFObjectArr: CSDXFObject[];
    HasSelected: boolean;
    Selected: CSDXFObject[];
    add( csDxfObject: CSDXFObject ): void;
    remove( csDxfObject: CSDXFObject ): void;
    get( id: number ): CSDXFObject | undefined;
    has( id: number ): boolean;
    clear(): void;
}