import { CAMERA_TYPE, CSCameraControls, type ICSCameraControls } from "../CSCameraControls";
import { CSRender, type ICSRender } from "../CSRender";
import { CSScene } from "../CSScene/CSScene";
import type { ICSScene } from "../CSScene/ICSScene";
import type { ICSCore } from "./ICSCore";

export class CSCore implements ICSCore {

    private readonly _csRender: ICSRender;
    private readonly _csCameraControls: ICSCameraControls;
    private readonly _csScene: ICSScene;
    private readonly _animateCallback: FrameRequestCallback;

    constructor( 
        root: HTMLDivElement 
    ){

        root.classList.add( 'relative', 'bg-neutral-800', 'select-none' );
        const elHandler = document.createElement('div');
        elHandler.classList.add( 'absolute', 'w-full', 'h-full', 'top-0', 'left-0', 'rounded-lg' );

        this._csScene = new CSScene( );
        this._csCameraControls = new CSCameraControls( elHandler );
        this._csScene.add( ...this._csCameraControls.Cameras );

        this._csRender = new CSRender( root, elHandler, this._csScene, this._csCameraControls.Camera );

        // const resizeObserver = new ResizeObserver( ( entries: ResizeObserverEntry[], observer: ResizeObserver ) => {
        //     this.resize( root.offsetWidth, root.offsetHeight );
        // });
        // resizeObserver.observe( root );
        
        this._animateCallback = this._animate.bind( this )
        this._animate();
    }

    public resize( width: number, height: number ): void {
        // console.log('resize observer width: ', width, ', height: ', height );
        this._csCameraControls.resize( width, height );
        this._csRender.resize( width, height );
    }

    private _animate() {
        requestAnimationFrame( this._animateCallback );
        this._csCameraControls.Controls.update();
        this._csRender.render();
    }
    
    public switchCamera( type: CAMERA_TYPE ): void {
        this._csCameraControls.switchCamera( type );
        this._csRender.setCamera( this._csCameraControls.Camera );
    }
}