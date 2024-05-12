import * as THREE from 'three';
import type { ICSDXFObject } from '../CSObjects';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export interface ICSTransform {
    TransformControls: TransformControls;
    IsEnabled: boolean;
    enable(): void;
    disable(): void;
    attach( ...csdxfobj: ICSDXFObject[] ): void;
    detach( ...csdxfobj: ICSDXFObject[] ): void;
}