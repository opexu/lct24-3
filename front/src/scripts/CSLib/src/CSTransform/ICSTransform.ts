import * as THREE from 'three';
import type { ICSDXFObject } from '../CSObjects';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import type { EventEmitter } from '../EventEmitter';

export interface ICSTransform extends EventEmitter<CSTransformEvent> {
    TransformControls: TransformControls;
    IsEnabled: boolean;
    enable(): void;
    disable(): void;
    attach( ...csdxfobj: ICSDXFObject[] ): void;
    detach( ...csdxfobj: ICSDXFObject[] ): void;
    setMode( mode: 'translate' | 'rotate' ): void;
}

export enum CSTransformEventKey {
    CHANGE = 'CSTransformEventKey.CHANGE',
}

export interface CSTransformEvent {
    [CSTransformEventKey.CHANGE]: ICSDXFObject;
}