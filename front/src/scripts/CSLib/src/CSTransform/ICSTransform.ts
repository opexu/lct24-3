import * as THREE from 'three';
import type { ICSMafObject, ICSObject } from '../CSObjects';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import type { EventEmitter } from '../EventEmitter';

export interface ICSTransform extends EventEmitter<CSTransformEvent> {
    TransformControls: TransformControls;
    IsEnabled: boolean;
    enable(): void;
    disable(): void;
    attach( ...csdxfobj: ICSObject[] ): void;
    detach( ...csdxfobj: ICSObject[] ): void;
    setMode( mode: 'translate' | 'rotate' ): void;
}

export enum CSTransformEventKey {
    CHANGE = 'CSTransformEventKey.CHANGE',
}

export interface CSTransformEvent {
    [CSTransformEventKey.CHANGE]: ICSMafObject;
}