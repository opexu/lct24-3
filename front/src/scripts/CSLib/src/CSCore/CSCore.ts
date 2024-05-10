import type { IDxf } from "dxf-parser";
import { CAMERA_TYPE, CSCameraControls, type ICSCameraControls } from "../CSCameraControls";
import { CSRender, type ICSRender } from "../CSRender";
import { CSScene } from "../CSScene/CSScene";
import type { ICSScene } from "../CSScene/ICSScene";
import type { ICSCore } from "./ICSCore";
import * as THREE from 'three';
import { CSDXFParser } from "../CSUtils/CSDXFParser";
import { CSBuilder } from "../CSBuilder/CSBuilder";

export class CSCore implements ICSCore {

    private readonly _CSRender: ICSRender;
    private readonly _CSCameraControls: ICSCameraControls;
    private readonly _CSScene: ICSScene;
    private readonly _animateCallback: FrameRequestCallback;

    constructor( 
        root: HTMLDivElement 
    ){

        root.classList.add( 'relative', 'bg-neutral-800', 'select-none' );
        const elHandler = document.createElement('div');
        elHandler.classList.add( 'absolute', 'w-full', 'h-full', 'top-0', 'left-0', 'rounded-lg' );

        this._CSScene = new CSScene( );
        this._CSCameraControls = new CSCameraControls( elHandler );
        this._CSScene.add( ...this._CSCameraControls.Cameras );

        this._CSRender = new CSRender( root, elHandler, this._CSScene, this._CSCameraControls.Camera );

        // const resizeObserver = new ResizeObserver( ( entries: ResizeObserverEntry[], observer: ResizeObserver ) => {
        //     this.resize( root.offsetWidth, root.offsetHeight );
        // });
        // resizeObserver.observe( root );
        
        this._animateCallback = this._animate.bind( this )
        this._animate();
    }

    public resize( width: number, height: number ): void {
        // console.log('resize observer width: ', width, ', height: ', height );
        this._CSCameraControls.resize( width, height );
        this._CSRender.resize( width, height );
    }

    private _animate() {
        requestAnimationFrame( this._animateCallback );
        this._CSCameraControls.Controls.update();
        this._CSRender.render();
    }
    
    public switchCamera( type: CAMERA_TYPE ): void {
        this._CSCameraControls.switchCamera( type );
        this._CSRender.setCamera( this._CSCameraControls.Camera );
    }

    public setBackgroundColor( hex: string ): void {
        this._CSScene.background = new THREE.Color( hex );
    }
    
    public drawDxf( dxf: IDxf ): void {
        const dxfParser = new CSDXFParser();
        const dxfParsed = dxfParser.parse( dxf );
        const csBuilder = new CSBuilder();
        const cdObjects = dxfParsed.map( dp => csBuilder.createRaw( dp ) );
        this._CSScene.add2D( ...cdObjects );
    }
}