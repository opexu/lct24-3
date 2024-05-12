import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { CSTransformEventKey, type CSTransformEvent, type ICSTransform } from "./ICSTransform";
import { CSCameraEventKey, type ICSCameraControls } from '../CSCameraControls';
import type { CSDXFObject, ICSDXFObject } from '../CSObjects';
import { EventEmitter } from '../EventEmitter';

export class CSTransform extends EventEmitter<CSTransformEvent> implements ICSTransform {
    
    private readonly _CSCameraControls: ICSCameraControls;
    private readonly _transformControls: TransformControls;
    private _csDxfObj: ICSDXFObject | undefined;

    constructor(
        el: HTMLElement,
        CSCameraControls: ICSCameraControls,
    ){
        super();
        this._CSCameraControls = CSCameraControls;
        this._CSCameraControls.on( CSCameraEventKey.CAMERA_CHANGED, ( camera ) => {
            this._transformControls.camera = camera;
        });
        this._transformControls = new TransformControls( this._CSCameraControls.Camera, el );
        this._transformControls.setSize( 0.5 );
        this.setMode( 'translate' );
        this._transformControls.enabled = false;

        this._transformControls.addEventListener( 'objectChange', () => {
            if( !this._csDxfObj ) return;
            this.emit( CSTransformEventKey.CHANGE, this._csDxfObj );
        })
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
        this._transformControls.detach();
        this._csDxfObj = undefined;
    }

    public attach( csObj: CSDXFObject ){
        if( !this._transformControls.enabled ) return;
        if( this._transformControls.mode === 'rotate' && !csObj.CanRotate ){
            this.setMode( 'translate' );
        }
        this._transformControls.attach( csObj.Object2D );
        this._csDxfObj = csObj;
    }

    public detach(){
        if( !this._transformControls.enabled ) return;
        this._transformControls.detach();
        this._csDxfObj = undefined;
    }

    public setMode( mode: 'translate' | 'rotate' ): void {
        this._transformControls.setMode( mode );
        if( mode === 'translate' ){
            this._transformControls.showX = true;
            this._transformControls.showY = false;
            this._transformControls.showZ = true;
        }else{
            this._transformControls.showX = false;
            this._transformControls.showY = true;
            this._transformControls.showZ = false;
        }
        
    }
}