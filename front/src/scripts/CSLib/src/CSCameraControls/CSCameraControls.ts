import { CAMERA_TYPE, type ICSCameraControls } from "./ICSCameraControls";
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls';

export class CSCameraControls implements ICSCameraControls {

    private readonly _controls: MapControls;
    private readonly _PCamera: THREE.PerspectiveCamera;
    private readonly _OCamera: THREE.OrthographicCamera;
    private _ACamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

    constructor(
        container: HTMLElement,
    ){

        const PCP = {
            fov: 50,
            near: 1,
            far: 10000,
        };
        const aspect = container.offsetWidth / container.offsetHeight;
        this._PCamera = new THREE.PerspectiveCamera( PCP.fov, aspect, PCP.near, PCP.far );
        this._PCamera.position.set( 10, 10, 10 );

        this._OCamera = new THREE.OrthographicCamera();

        this._ACamera = this._PCamera;

        this._controls = new MapControls( this._ACamera, container );
        this._controls.mouseButtons = {
            // LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        }
    }
    
    get Cameras(){ return [ this._PCamera, this._OCamera ]; }
    get Camera(){ return this._ACamera; }
    get Controls(){ return this._controls; }

    public switchCamera( type: CAMERA_TYPE ): void {
        if( this._isPerpsCamera( this._ACamera ) ){
            if( type === CAMERA_TYPE.PERSPECTIVE ) return;
            this._ACamera = this._OCamera;
        }else{
            if( type === CAMERA_TYPE.ORTHOGRAPHIC ) return;
            this._ACamera = this._PCamera;
        }
        this._controls.update();
    }

    public resize( width: number, height: number ){
        if( this._isPerpsCamera( this._ACamera ) ){
            this._ACamera.aspect = width / height;
        }else{
            // TODO
        }
        
        this._ACamera.updateProjectionMatrix();
        this._controls.update();
    }

    private _isPerpsCamera( camera: THREE.PerspectiveCamera | THREE.OrthographicCamera ): camera is THREE.PerspectiveCamera {
        return 'isPerspectiveCamera' in camera && camera.isPerspectiveCamera;
    }
}