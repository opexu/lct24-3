import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import type { ICSTransform } from "./ICSTransform";
import { CSCameraEventKey, type ICSCameraControls } from '../CSCameraControls';
import type { CSDXFObject } from '../CSObjects';

export class CSTransform implements ICSTransform {
    
    private readonly _CSCameraControls: ICSCameraControls;
    private readonly _transformControls: TransformControls;
    
    constructor(
        el: HTMLElement,
        CSCameraControls: ICSCameraControls,
    ){
        this._CSCameraControls = CSCameraControls;
        this._CSCameraControls.on( CSCameraEventKey.CAMERA_CHANGED, ( camera ) => {
            this._transformControls.camera = camera;
        });
        this._transformControls = new TransformControls( this._CSCameraControls.Camera, el );
        this._transformControls.showY = false;
        this._transformControls.setSize( 0.5 );
    }

    get TransformControls(){ return this._transformControls; }
    get IsEnabled(){ return this._transformControls.enabled; }

    public enable(): void {
        if( this._transformControls.enabled ) return;
        this._transformControls.enabled = true;
    }

    public disable(): void {
        if( !this._transformControls.enabled ) return;
        this._transformControls.enabled = false;
    }

    public attach( object3D: CSDXFObject ){
        if( !this._transformControls.enabled ) return;
        this._transformControls.attach( object3D.Object2D );
    }

    public detach(){
        if( !this._transformControls.enabled ) return;
        this._transformControls.detach();
    }

    
}