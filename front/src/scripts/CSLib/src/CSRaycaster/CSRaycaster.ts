import * as THREE from 'three';
import type { ICSScene } from "../CSScene/ICSScene";
import type { ICSRaycastEvent, ICSRaycaster } from "./ICSRaycaster";
import type { ICSCameraControls } from '../CSCameraControls';
import type { ICSObjectCache } from '../CSCache';
import { EventEmitter } from '../EventEmitter';
import type { ICSTransform } from '../CSTransform/ICSTransform';
import type { ICSObject } from '../CSObjects';

export class CSRaycater extends EventEmitter<ICSRaycastEvent> implements ICSRaycaster {
    
    private _isEnabled = false;

    private readonly _el: HTMLElement;
    private readonly _eventMap: {[key: string]: ( e: Event ) => void }

    private readonly _CSScene: ICSScene;
    private readonly _CSCameraControls: ICSCameraControls;
    private readonly _CSObjectCache: ICSObjectCache<ICSObject>;
    private readonly _CSTransform: ICSTransform;

    private readonly _raycaster: THREE.Raycaster;
    private readonly _coords: THREE.Vector2;

    constructor(
        el: HTMLElement,
        CSScene: ICSScene,
        CSCameraControls: ICSCameraControls,
        CSObjectCache: ICSObjectCache<ICSObject>,
        CSTransform: ICSTransform,
    ){
        super();

        this._eventMap = {
            'pointerdown': this._onClick.bind( this ),
        }

        this._el = el;
        this._CSScene = CSScene;
        this._CSCameraControls = CSCameraControls;
        this._CSObjectCache = CSObjectCache;
        this._CSTransform = CSTransform;

        this._raycaster = new THREE.Raycaster();
        this._raycaster.layers.set( 2 );
        this._coords = new THREE.Vector2();

        this.enable();
    }
    
    get IsEnabled(){ return this._isEnabled; }
    
    public enable(){
        if( this._isEnabled ) return;
        this._el.addEventListener( 'pointerdown', this._eventMap['pointerdown'] )
        this._isEnabled = true;
    }

    public disable(){
        if( !this._isEnabled ) return;
        this._el.removeEventListener( 'pointerdown', this._eventMap['pointerdown'] )
        this._isEnabled = false;
    }

    private _onClick( event: Event ){
        if( !(event instanceof PointerEvent)) return;
        if( event.buttons !== 1 ) return;
        if( this._CSTransform.TransformControls.dragging ) return;
        
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

        const mouseX = (event as PointerEvent).clientX - rect.left;
        const mouseY = (event as PointerEvent).clientY - rect.top;

        this._coords.setX( ( mouseX / (event.currentTarget as HTMLElement).clientWidth ) * 2 - 1 );
        this._coords.setY( -( mouseY / (event.currentTarget as HTMLElement).clientHeight ) * 2 + 1 );
        
        this._raycast( this._coords );
    }

    private _raycast( coords: THREE.Vector2 ): void {
        const camera = this._CSCameraControls.Camera;
        this._raycaster.setFromCamera( coords, camera );
        const intersects = this._raycaster.intersectObjects( this._CSScene.Group2D.children, true );
        if( intersects.length > 0 ){

            const csObject = this._CSObjectCache.get( intersects[0].object.userData.ID )

            if( !csObject ) return;
            if( csObject.IsSelected ){
                csObject.deselect();
            }else{
                csObject.select();
            }
        }else{
            this._CSObjectCache.Map.forEach( csObj => csObj.IsSelected && csObj.deselect() );
        }
    }

}