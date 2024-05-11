import type { IDxf } from "dxf-parser";
import { CAMERA_TYPE, CSCameraControls, type ICSCameraControls } from "../CSCameraControls";
import { CSRender, type ICSRender } from "../CSRender";
import { CSScene } from "../CSScene/CSScene";
import type { ICSScene } from "../CSScene/ICSScene";
import { CSEvent, CSMode, type CSCoreEvent, type ICSCore } from "./ICSCore";
import * as THREE from 'three';
import { CSDXFParser } from "../CSUtils/CSDXFParser";
import { CSBuilder } from "../CSBuilder/CSBuilder";
import { CSDXFObject, CSDXFObjectEvent, type DXFObjectEvent } from "../CSObjects";
import type { ICSRaycaster } from "../CSRaycaster/ICSRaycaster";
import { CSRaycater } from "../CSRaycaster/CSRaycaster";
import { CSObjectCache, type ICSObjectCache } from "../CSCache";
import { EventEmitter } from "../EventEmitter";

export class CSCore extends EventEmitter<CSCoreEvent> implements ICSCore {
    
    private _bbox = new THREE.Box3( new THREE.Vector3(), new THREE.Vector3() );
    private _mode = CSMode.DXF;

    private readonly _CSRender: ICSRender;
    private readonly _CSCameraControls: ICSCameraControls;
    private readonly _CSScene: ICSScene;
    private readonly _CSRaycaster: ICSRaycaster;
    private readonly _CSObjectCache: ICSObjectCache;

    private readonly _animateCallback: FrameRequestCallback;

    constructor( 
        root: HTMLDivElement,
    ){
        super();

        root.classList.add( 'relative', 'bg-neutral-800', 'select-none' );
        const elHandler = document.createElement('div');
        elHandler.classList.add( 'absolute', 'w-full', 'h-full', 'top-0', 'left-0', 'rounded-lg' );

        this._CSScene = new CSScene( );
        this._CSCameraControls = new CSCameraControls( elHandler );
        this._CSScene.add( ...this._CSCameraControls.Cameras );

        this._CSRender = new CSRender( root, elHandler, this._CSScene, this._CSCameraControls.Camera );

        this._CSObjectCache = new CSObjectCache();

        this._CSRaycaster = new CSRaycater( elHandler, this._CSScene, this._CSCameraControls, this._CSObjectCache );
        
        // const resizeObserver = new ResizeObserver( ( entries: ResizeObserverEntry[], observer: ResizeObserver ) => {
        //     this.resize( root.offsetWidth, root.offsetHeight );
        // });
        // resizeObserver.observe( root );
        
        this._animateCallback = this._animate.bind( this )
        this._animate();
    }

    get Mode(){ return this._mode; }
    get Bbox(){ return this._bbox; }

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

    public recenterCamera(): void {
        this._CSCameraControls.recenter( this._bbox );
    }

    public setBackgroundColor( hex: string ): void {
        this._CSScene.background = new THREE.Color( hex );
    }
    
    public drawDxf( dxf: IDxf ): void {
        const dxfParser = new CSDXFParser();
        const dxfParsed = dxfParser.parse( dxf );
        const csBuilder = new CSBuilder();
        const csObjects = dxfParsed.map( dp => {
            const csObj = csBuilder.createDxfObject( dp );
            this._CSObjectCache.add( csObj );
            csObj.on( CSDXFObjectEvent.SELECT, ( event ) => {
                this.emit( CSEvent.DXF_OBJ_SELECT, event )
            })
            csObj.on( CSDXFObjectEvent.DESELECT, ( event ) => {
                this.emit( CSEvent.DXF_OBJ_DESELECT, event )
            })
            return csObj;
        });
        csObjects.forEach( cso => this._bbox.union( cso.Object2D.geometry.boundingBox! ) );
        this._CSScene.addDxfObject( ...csObjects );
    }

    public clearDxf(): void {
        const csDxfObjectArr = this._CSObjectCache.CSDXFObjectArr;
        csDxfObjectArr.forEach( csdxf => {
            csdxf.dispose();
        })
        this._CSScene.removeDxfObject( ...csDxfObjectArr );
        this._CSObjectCache.clear();
    }

    public setMode( newMode: CSMode ){
        if( this._mode === newMode ) return false;
        this._mode = newMode;
        // TODO
        return true;
    }

    public removeDxfObject( ...object: CSDXFObject[] ): void {
       // TODO
    }

    private _onDXFObjectSelected( event: DXFObjectEvent ){

    }
}