import type { ICSObject } from "../CSObjects";

export interface ICSObjectCache<T extends ICSObject> {
    Map: Map<number, T>;
    CSObjectArr: T[];
    HasSelected: boolean;
    Selected: T[];
    add( csDxfObject: T ): void;
    remove( csDxfObject: T ): void;
    get( id: number ): T | undefined;
    has( id: number ): boolean;
    clear(): void;
}