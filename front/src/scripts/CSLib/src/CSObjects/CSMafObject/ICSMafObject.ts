import type { IMafFull } from '@/types/IReestr';
import type { IStrapi } from '@/types/strapi';
import * as THREE from 'three';
import type { ICSSelectable, ICollidable, IDisposable, IGeoProps, ISerializable, IsMaf } from '../common';
import type { IEventable } from '../../EventEmitter';

export interface ICSMafObjectConstructorOpts {
    maf: IStrapi<IMafFull>;
}



export interface ICSMafObject extends IEventable<MafObjectEvent>, ICSSelectable, IDisposable, IsMaf, IGeoProps, ICollidable, ISerializable {
    ID: number;
    Object2D: THREE.Object3D;
    Maf: IStrapi<IMafFull>;
    CanRotate: boolean;
}

export enum CSMafObjectEvent {
    SELECT = 'CSMafObjectEvent.SELECT',
    DESELECT = 'CSMafObjectEvent.DESELECT',
    UPDATED = 'CSMafObjectEvent.UPDATED',
}

export interface MafObjectEvent {
    [CSMafObjectEvent.SELECT]: ICSMafObject;
    [CSMafObjectEvent.DESELECT]: ICSMafObject;
    [CSMafObjectEvent.UPDATED]: ICSMafObject;
}