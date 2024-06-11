import * as THREE from 'three';
import type { IEventable } from '../../EventEmitter';
import type { IStrapi } from '@/types/strapi';
import type { IPlaygroundFull } from '@/types/IReestr';

export interface ICSBorderObjectConstructorOpts {
    playground: IStrapi<IPlaygroundFull>;
}

export interface ICSBorderObject {
    ID: number;
    IDName: string;
    Playground: IStrapi<IPlaygroundFull>;
    Object2D: THREE.Object3D;
    RaycastObject2D: THREE.Object3D;
    IsSelected: boolean;
}