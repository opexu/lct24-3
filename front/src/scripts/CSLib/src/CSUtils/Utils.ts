import type { IMinMax, IMultiDimArray, IPoint2D } from '@/types/IReestr';
import * as THREE from 'three';

export function IsMesh( obj: THREE.Object3D ): obj is THREE.Mesh {
    return obj instanceof THREE.Mesh;
    // return 'isMesh' in obj && typeof obj.isMesh === 'boolean' && obj.isMesh;
}

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

export function PlaygroundCoordsParser( coords: IMultiDimArray<IPoint2D>, scale: number = 100 ): THREE.Vector3[][] | null {

    const arr: IPoint2D[][] = [];
    if( isPoint2DArray( coords )) {+
        // const d = coords.map( obj => new THREE.Vector3( obj.x, 0, obj.y ));
        arr.push( coords.map( c => ({ x: c.x * scale, y: c.y * scale })) );
    }else{
        coords.forEach( obj => {
            if( isPoint2DArray( obj ) ){
                // const d = obj.map( o => new THREE.Vector3( o.x, 0, o.y ));
                arr.push( obj.map( c => ({ x: c.x * scale, y: c.y * scale })) );
            }else{
                console.warn('too deep');
            }
        });
    }

    const min = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };
    const max = { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY };

    arr.forEach( pointsArr => {
        pointsArr.forEach( p => {
            if( p.x < min.x ) min.x = p.x;
            if( p.y < min.y ) min.y = p.y;
            if( p.x > max.x ) max.x = p.x;
            if( p.x > max.y ) max.y = p.y;
        })
    });
    console.log('pointsArr: ', arr)
    const box3 = new THREE.Box3( new THREE.Vector3( min.x, 0, min.y ), new THREE.Vector3( max.x, 0, max.y ) );
    const boxOrigin = new THREE.Vector3();
    box3.getCenter( boxOrigin );
    boxOrigin.negate();
    const translationMatrix = new THREE.Matrix4();
    translationMatrix.set(
        1, 0, 0, boxOrigin.x,
        0, 1, 0, 0,
        0, 0, 1, boxOrigin.z,
        0, 0, 0, 1,
    );

    const vectorArr: THREE.Vector3[][] = [];
    arr.forEach( pointsArr => {
        const vArr: THREE.Vector3[] = [];
        pointsArr.forEach( p => {
            const v = new THREE.Vector3( p.x, 0, p.y );
            v.applyMatrix4( translationMatrix );
            vArr.push( v );
        });
        vectorArr.push( vArr );
    });
    console.log('vectorArr: ', vectorArr)
    return vectorArr;
}

export function isPoint2DArray( arr: IMultiDimArray<IPoint2D> ): arr is IPoint2D[] {
    if( Array.isArray( arr ) && 'x' in arr[0] ) return true;
    else return false;
}