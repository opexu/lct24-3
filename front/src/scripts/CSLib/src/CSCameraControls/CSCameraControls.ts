import { CAMERA_TYPE, CSCameraEventKey, type CSCameraEvent, type ICSCameraControls } from "./ICSCameraControls";
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { EventEmitter } from "../EventEmitter";

export class CSCameraControls extends EventEmitter<CSCameraEvent> implements ICSCameraControls {

    private readonly _controls: MapControls;
    private readonly _PCamera: THREE.PerspectiveCamera;
    private readonly _OCamera: THREE.OrthographicCamera;
    private _aspect: number;

    constructor(
        container: HTMLElement,
    ){
        super();
        const PCP = {
            fov: 50,
            near: 0.1,
            far: 100000,
        };
        const OCP = {
            frustum: 50,
        }
        const startPos = 500;
        this._aspect = container.offsetWidth / container.offsetHeight;
        this._PCamera = new THREE.PerspectiveCamera( PCP.fov, this._aspect, PCP.near, PCP.far );
        this._PCamera.position.set( startPos, startPos, startPos );
        this._PCamera.layers.enable( 1 );
        this._PCamera.layers.enable( 2 );
        this._OCamera = new THREE.OrthographicCamera( OCP.frustum, OCP.frustum, OCP.frustum, OCP.frustum, PCP.near, PCP.far );
        this._OCamera.position.set( startPos, startPos, startPos );
        this._OCamera.layers.enable( 1 );
        this._OCamera.layers.enable( 2 );
        this._controls = new MapControls( this._PCamera, container );
        this._controls.mouseButtons = {
            // LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        }

        this._setPerspectiveCamera();
    }
    
    get Cameras(){ return [ this._PCamera, this._OCamera ]; }
    get Camera(){ return this._controls.object as THREE.PerspectiveCamera | THREE.OrthographicCamera; }
    get Controls(){ return this._controls; }

    public switchCamera( type: CAMERA_TYPE ): void {
        if( this._isPerpsCamera( this.Camera ) ){
            if( type === CAMERA_TYPE.PERSPECTIVE ) return;
            this._setOrthographicCamera();
        }else{
            if( type === CAMERA_TYPE.ORTHOGRAPHIC ) return;
            this._setPerspectiveCamera();
        }
        this._controls.update();
        this.emit( CSCameraEventKey.CAMERA_CHANGED, this.Camera );
    }

    public resize( width: number, height: number ){
        this._aspect = width / height;
        if( this._isPerpsCamera( this.Camera ) ){
            this.Camera.aspect = this._aspect;
        }else{
            const oldX = this.Camera.right;
            const oldY = this.Camera.top;
            const oldAspect = oldX / oldY;
            const oX = oldX / oldAspect;
            const nX = oX * this._aspect;

            this.Camera.left = -nX;
            this.Camera.right = nX;
        }
        
        this.Camera.updateProjectionMatrix();
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
        this._controls.maxPolarAngle = Math.PI / 2.99;
        this._controls.minAzimuthAngle = Infinity;
        this._controls.maxAzimuthAngle = Infinity;
    }

    private _setOrthographicCamera(){
        this._OCamera.position.copy( this._PCamera.position );
        
        // если дистанция большая, то перестает работать, нужно фиксить
        const distance = this._PCamera.position.distanceTo( this._controls.target );
        const halfWidth = this._frustumWidthAtDistance( this._PCamera, distance ) / 2;
        const halfHeight = this._frustumHeightAtDistance( this._PCamera, distance ) / 2;
        console.log('halfWidth', halfWidth)
        console.log('halfHeight', halfHeight)
        this._OCamera.top = halfHeight;
        this._OCamera.bottom = -halfHeight;
        this._OCamera.left = -halfWidth;
        this._OCamera.right = halfWidth;
        this._OCamera.zoom = this._PCamera.zoom;
        console.log('this._OCamera.zoom', this._OCamera.zoom)
        this._OCamera.lookAt( this._controls.target );
        console.log('this._controls.target', this._controls.target)
        this._OCamera.updateProjectionMatrix();

        this._controls.object = this._OCamera;
        this._controls.minPolarAngle = 0;
        this._controls.maxPolarAngle = 0;
        this._controls.minAzimuthAngle = 0;
        this._controls.maxAzimuthAngle = 0;
    }

    public recenter( bbox: THREE.Box3 ): void {
        const center = new THREE.Vector3();
        bbox.getCenter( center );
        center.setY( 0 );
        this._controls.target.set( center.x, center.y, center.z );
        this._controls.update();
    }
}