import type { CSDXFObject } from "../CSObjects";

export interface ICSObjectCache {
    CSDXFObjectArr: CSDXFObject[];
    add( csDxfObject: CSDXFObject ): void;
    remove( csDxfObject: CSDXFObject ): void;
    get( id: number ): CSDXFObject | undefined;
    has( id: number ): boolean;
    clear(): void;
}