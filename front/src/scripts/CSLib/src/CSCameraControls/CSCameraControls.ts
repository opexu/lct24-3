import { CAMERA_TYPE, type ICSCameraControls } from "./ICSCameraControls";
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls';

export class CSCameraControls implements ICSCameraControls {

    private readonly _controls: MapControls;
    private readonly _PCamera: THREE.PerspectiveCamera;
    private readonly _OCamera: THREE.OrthographicCamera;
    private _ACamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    private _aspect: number;

    constructor(
        container: HTMLElement,
    ){

        const PCP = {
            fov: 50,
            near: 1,
            far: 10000,
        };
        const OCP = {
            frustum: 50,
            near: 1,
            far: 10000,
        }
        this._aspect = container.offsetWidth / container.offsetHeight;
        this._PCamera = new THREE.PerspectiveCamera( PCP.fov, this._aspect, PCP.near, PCP.far );
        this._PCamera.position.set( 10, 10, 10 );

        this._OCamera = new THREE.OrthographicCamera( 0.5 * OCP.frustum, 0.5 * OCP.frustum, );

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
            this._setOrthographicCamera();
            this._ACamera = this._OCamera;
        }else{
            if( type === CAMERA_TYPE.ORTHOGRAPHIC ) return;
            this._setPerspectiveCamera();
            this._ACamera = this._PCamera;
        }
        this._controls.update();
    }

    public resize( width: number, height: number ){
        this._aspect = width / height;
        if( this._isPerpsCamera( this._ACamera ) ){
            this._ACamera.aspect = this._aspect;
        }else{
            const oldX = this._ACamera.right;
            const oldY = this._ACamera.top;
            const oldAspect = oldX / oldY;
            const oX = oldX / oldAspect;
            const nX = oX * this._aspect;

            this._ACamera.left = -nX;
            this._ACamera.right = nX;
        }
        
        this._ACamera.updateProjectionMatrix();
        this._controls.update();
    }

    private _isPerpsCamera( camera: THREE.PerspectiveCamera | THREE.OrthographicCamera ): camera is THREE.PerspectiveCamera {
        return 'isPerspectiveCamera' in camera && camera.isPerspectiveCamera;
    }

    private _frustumHeightAtDistance( camera: THREE.PerspectiveCamera, distance: number ) {
        const vFov = ( camera.fov * Math.PI ) / 180;
        return Math.tan( vFov / 2 ) * distance * 2;
    }

    private _frustumWidthAtDistance( camera: THREE.PerspectiveCamera, distance: number ) {
        return this._frustumHeightAtDistance( camera, distance ) * camera.aspect;
    }

    private _setPerspectiveCamera(){
        const oldY = this._PCamera.position.y;
        this._PCamera.position.copy( this._OCamera.position );
        this._PCamera.position.y = oldY / this._OCamera.zoom;
        this._PCamera.aspect = this._aspect;
        this._PCamera.updateProjectionMatrix();
        
        this._controls.object = this._PCamera;
        this._controls.minPolarAngle = 0;
        this._controls.maxPolarAngle = Math.PI;
        this._controls.minAzimuthAngle = Infinity;
        this._controls.maxAzimuthAngle = Infinity;
    }

    private _setOrthographicCamera(){
        this._OCamera.position.copy( this._PCamera.position );
        
        const distance = this._PCamera.position.distanceTo( this._controls.target );
        const halfWidth = this._frustumWidthAtDistance( this._PCamera, distance ) / 2;
        const halfHeight = this._frustumHeightAtDistance( this._PCamera, distance ) / 2;
        
        this._OCamera.top = halfHeight;
        this._OCamera.bottom = -halfHeight;
        this._OCamera.left = -halfWidth;
        this._OCamera.right = halfWidth;
        this._OCamera.zoom = 1;
        this._OCamera.lookAt( this._controls.target );
        this._OCamera.updateProjectionMatrix();

        this._controls.object = this._OCamera;
        this._controls.minPolarAngle = 0;
        this._controls.maxPolarAngle = 0;
        this._controls.minAzimuthAngle = 0;
        this._controls.maxAzimuthAngle = 0;
    }

    public recenter( bbox: THREE.Box3 ): void {
        
    }
}