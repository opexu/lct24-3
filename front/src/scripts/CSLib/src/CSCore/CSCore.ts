import type { IDxf } from "dxf-parser";
import { CAMERA_TYPE, CSCameraControls, type ICSCameraControls } from "../CSCameraControls";
import { CSRender, type ICSRender } from "../CSRender";
import { CSScene } from "../CSScene/CSScene";
import type { ICSScene } from "../CSScene/ICSScene";
import { CSEvent, CSMode, type CSCoreEvent, type ICSCore } from "./ICSCore";
import * as THREE from 'three';
import { CSDXFParser } from "../CSUtils/CSDXFParser";
import { CSMafObject, type ICSDXFObjectConstructorOpts, CSDXFObject, type ICSDXFObject, type ICSMafObject, CSDXFObjectEvent, CSMafObjectEvent, type ICSObject, IsMaf } from "../CSObjects";
import type { ICSRaycaster } from "../CSRaycaster/ICSRaycaster";
import { CSRaycater } from "../CSRaycaster/CSRaycaster";
import { CSObjectCache, type ICSObjectCache } from "../CSCache";
import { EventEmitter } from "../EventEmitter";
import { CSTransformEventKey, type ICSTransform } from "../CSTransform/ICSTransform";
import { CSTransform } from "../CSTransform/CSTransform";
import { CSBorderObject, type ICSBorderObject, type ICSBorderObjectConstructorOpts } from "../CSObjects/CSBorderObject";
import type { IStrapi } from "@/types/strapi";
import type { IDxfParsedMafObj, IMafFull, IMultiDimArray, IPlaygroundFull, IPoint2D } from "@/types/IReestr";
import { PlaygroundCoordsParser } from "../CSUtils";
import { CSCollision, type ICSCollision } from "../CSCollision";

export class CSCore extends EventEmitter<CSCoreEvent> implements ICSCore {
    
    private _bbox = new THREE.Box3( new THREE.Vector3(), new THREE.Vector3() );
    private _mode = CSMode.SELECT;

    private _hasBorders = false;

    private readonly _CSRender: ICSRender;
    private readonly _CSCameraControls: ICSCameraControls;
    private readonly _CSScene: ICSScene;
    private readonly _CSRaycaster: ICSRaycaster;
    private readonly _CSObjectCache: ICSObjectCache<ICSObject>;
    private readonly _CSTransform: ICSTransform;
    private readonly _CSCollision: ICSCollision;
    private readonly _animateCallback: FrameRequestCallback;

    private _csBorderObjectsArr: ICSBorderObject[] = [];

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
        
        this._CSTransform = new CSTransform( elHandler, this._CSCameraControls );
        this._CSTransform.on( CSTransformEventKey.CHANGE, ( csobj ) => {
            this._CSCollision.update( csobj );
            this.emit( CSEvent.TRANSFORM_UPDATE, csobj );
        })
        this._CSRaycaster = new CSRaycater( elHandler, this._CSScene, this._CSCameraControls, this._CSObjectCache, this._CSTransform );
        
        this._CSScene.add( this._CSTransform.TransformControls );
        // const resizeObserver = new ResizeObserver( ( entries: ResizeObserverEntry[], observer: ResizeObserver ) => {
        //     this.resize( root.offsetWidth, root.offsetHeight );
        // });
        // resizeObserver.observe( root );
        
        this._CSCollision = new CSCollision();

        this._animateCallback = this._animate.bind( this )
        this._animate();
    }

    get Mode(){ return this._mode; }
    get Bbox(){ return this._bbox; }
    get HasBorders(){ return this._hasBorders; }
    get CSObjectsArr(){ return this._CSObjectCache.CSObjectArr; }
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
        const csObjects = dxfParsed.map( dp => {
            const opts: ICSDXFObjectConstructorOpts = {
                color: dp.color,
                type: dp.type,
                layer: dp.layer,
            }
            const csObj = new CSDXFObject( dp.points, opts );
            // const csObj = csBuilder.createDxfObject( dp );
            this._CSObjectCache.add( csObj );
            csObj.on( CSDXFObjectEvent.SELECT, ( event ) => {
                if( this._CSObjectCache.Selected.length === 1 ){
                    this._CSTransform.attach( event );
                }else{
                    this._CSTransform.detach();
                }
                
                this.emit( CSEvent.SELECT, event );
            });
            csObj.on( CSDXFObjectEvent.DESELECT, ( event ) => {
                if( this._CSObjectCache.Selected.length === 1 ){
                    this._CSTransform.attach( this._CSObjectCache.Selected[0] );
                }else{
                    this._CSTransform.detach();
                }
                this.emit( CSEvent.DESELECT, event );
            });
            csObj.on( CSDXFObjectEvent.UPDATED, ( event ) => {
                this.emit( CSEvent.UPDATED, event );
            });
            return csObj;
        });
        csObjects.forEach( cso => {
            this._bbox.union( cso.Object2D.geometry.boundingBox! );
            this._CSCollision.add( cso );
        });
        this._CSScene.addCSObject( ...csObjects );
    }

    public drawMaf( parsedMafGeo: IDxfParsedMafObj, mafInfo: IStrapi<IMafFull> ): void {
        if( this._CSObjectCache.has( mafInfo.id ) ){
            console.warn(`Маф с ID: ${mafInfo.id} уже находится в сцене`);
            return;
        }
        const csObj = new CSMafObject( parsedMafGeo, { maf: mafInfo });
        this._CSObjectCache.add( csObj );
        csObj.on( CSMafObjectEvent.SELECT, ( event ) => {
            if( this._CSObjectCache.Selected.length === 1 ){
                this._CSTransform.attach( event );
            }else{
                this._CSTransform.detach();
            }
            
            this.emit( CSEvent.SELECT, event );
        });
        csObj.on( CSMafObjectEvent.DESELECT, ( event ) => {
            if( this._CSObjectCache.Selected.length === 1 ){
                this._CSTransform.attach( this._CSObjectCache.Selected[0] );
            }else{
                this._CSTransform.detach();
            }
            this.emit( CSEvent.DESELECT, event );
        });
        csObj.on( CSMafObjectEvent.UPDATED, ( event ) => {
            this.emit( CSEvent.UPDATED, event );
        });
        this._bbox.union( csObj.Object2D.geometry.boundingBox! );
        this._CSCollision.add( csObj );
        this._CSScene.addCSObject( csObj );
    }

    public removeMaf( id: number ): void {
        if( !this._CSObjectCache.has( id ) ){
            console.warn(`Маф с ID: ${id} отсутствует в сцене`);
            return;
        }
        const csObj = this._CSObjectCache.get( id )!;
        csObj.deselect();
        this._CSCollision.remove( csObj );
        this._CSScene.removeCSObject( csObj );
        this._CSObjectCache.remove( csObj );
        csObj.dispose();
    }

    public clearDxf(): void {
        this._CSObjectCache.CSObjectArr.forEach( cs => cs.dispose() );
        this._CSTransform.disable();
        // this._CSScene.removeDxfObject( ...csDxfObjectArr );
        this._CSScene.Group2D.clear();
        this._CSObjectCache.clear();
    }

    public drawBorders( playground: IStrapi<IPlaygroundFull> ): void {
        if( this._CSScene.BorderGroup.getObjectByName( playground.id.toString() ) ){
            console.warn('Объект уже существует в сцене');
            return;
        }
        const coords = playground.attributes.Coords; 
        if( !coords ){
            console.warn('Координаты отсутствуют');
            return
        }

        const multiPointsArr = PlaygroundCoordsParser( coords );
        console.log('multiPointsArr', multiPointsArr)
        if( !multiPointsArr || multiPointsArr.length === 0 ) return;

        this._hasBorders = true;
        const csBorderObjArr = multiPointsArr.map( points => new CSBorderObject( points, { playground }));
        csBorderObjArr.forEach( cso => {
            this._bbox.union( cso.Object2D.geometry.boundingBox! )
            this._CSCollision.add( cso );
        });
        this._csBorderObjectsArr.push( ...csBorderObjArr );
        this._CSScene.addBorderObject( ...csBorderObjArr );
    }

    public removeBorders(): void {
        // TODO dispose
        this._csBorderObjectsArr.forEach( cso => this._CSCollision.remove( cso ) );
        this._csBorderObjectsArr = [];
        this._CSScene.BorderGroup.clear();
        this._hasBorders = false;
    }
    
    public setMode( newMode: CSMode ){
        if( this._mode === newMode ) return;
        this._mode = newMode;
        switch( this._mode ){
            case CSMode.SELECT: {
                this._CSTransform.disable();
                break;
            }
            case CSMode.EDIT: {
                this._CSTransform.enable();
                if( this._CSObjectCache.Selected.length === 1 ){
                    this._CSTransform.attach( this._CSObjectCache.Selected[0] );
                }
                break;
            }
        }
    }

    public setTransformMode( mode: 'translate' | 'rotate' ) {
        this._CSTransform.setMode( mode );
    }

    public removeDxfObject( ...object: CSMafObject[] ): void {
       // TODO
    }

    public selectByLayers( layersArr: string[] ): void {
        this._CSObjectCache.Map.forEach(( csdxf, id ) => {
            !IsMaf( csdxf ) && !csdxf.IsSelected && layersArr.includes( csdxf.DXFLayer ) && csdxf.select();
        });
    }

    public deselectByLayers( layersArr: string[] ): void {
        this._CSObjectCache.Map.forEach(( csdxf, id ) => {
            !IsMaf( csdxf ) && csdxf.IsSelected && layersArr.includes( csdxf.DXFLayer ) && csdxf.deselect();
        })
        // TODO edit event
        this.emit( CSEvent.DESELECT_ALL, null );
    }

    public deselectAll(): void {
        this._CSObjectCache.Map.forEach(( csdxf, id ) => {
            csdxf.IsSelected && csdxf.deselect();
        })
    }
}