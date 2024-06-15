import * as THREE from 'three';
import type { IEventable } from '../../EventEmitter';
import type { IStrapi } from '@/types/strapi';
import type { IPlaygroundFull } from '@/types/IReestr';
import type { ICollidable } from '../common';

export interface ICSBorderObjectConstructorOpts {
    playground: IStrapi<IPlaygroundFull>;
}

export interface ICSBorderObject extends ICollidable {
    ID: number;
    Playground: IStrapi<IPlaygroundFull>;
    Object2D: THREE.Object3D;
    IsSelected: boolean;
}