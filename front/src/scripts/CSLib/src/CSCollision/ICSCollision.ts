import type { CSObject, ICSObject, ICollidable } from "../CSObjects";

export interface ICSCollision {
    add( csobj: ICollidable ): void;
    remove( csobj: ICollidable ): void;
    update( csobj: ICSObject ): void;
}