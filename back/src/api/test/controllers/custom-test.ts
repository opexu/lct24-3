import * as THREE from 'three';

export default {
    async count( ctx ){
        const v1 = new THREE.Vector3( 1.0, 0.0, 0.0 );
        const v2 = new THREE.Vector3( 2.0, 0.0, 0.0 );
        const v3 = v1.add( v2 );
        console.log('v3: ', v3)
    }
}