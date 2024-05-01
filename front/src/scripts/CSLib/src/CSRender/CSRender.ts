import type { ICSRender } from "./ICSRender";
import * as THREE from 'three';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import type { ICSScene } from "../CSScene/ICSScene";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

export class CSRender implements ICSRender {

    private readonly _scene: ICSScene;
    private readonly _camera: THREE.Camera;

    private readonly _composer: EffectComposer;
    private readonly _2DRenderer: CSS2DRenderer;

    constructor(
        root: HTMLElement,
        root2D: HTMLElement,
        scene: ICSScene,
        camera: THREE.Camera,
    ){
        this._scene = scene;
        this._camera = camera;

        const canvas = document.createElement('canvas');
        canvas.classList.add( 'w-full', 'h-full', 'rounded-lg' );
        
        const WebGLRendererParams: THREE.WebGLRendererParameters = {
            canvas,
            premultipliedAlpha: false,
            antialias: true,
            logarithmicDepthBuffer: false,
        };
        const renderer = new THREE.WebGLRenderer( WebGLRendererParams );
        renderer.setSize( root.offsetWidth, root.offsetHeight );

        this._2DRenderer = new CSS2DRenderer({ element: root2D });
        this._composer = new EffectComposer( renderer );
        const renderPass = new RenderPass( this._scene, camera );
        this._composer.addPass( renderPass );

        root.append( canvas );
        root.append( root2D );
    }

    public render(): void {
        this._composer.render();
        this._2DRenderer.render( this._scene, this._camera );
    }

    public resize( width: number, height: number ){
        this._composer.renderer.setSize( width, height );
        this._2DRenderer.setSize( width, height );
        this._composer.setSize( width, height );
    }
}