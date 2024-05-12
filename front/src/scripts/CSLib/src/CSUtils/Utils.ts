import * as THREE from 'three';

export function IsMaterial( material: THREE.Material | THREE.Material[] ): material is THREE.Material {
    return !Array.isArray( material )
}

export function DisposeMaterial( material: THREE.Material | THREE.Material[] ){
    if( IsMaterial( material ) ){
        material.dispose();
    }else{
        material.forEach( m => m.dispose() );
    }
}