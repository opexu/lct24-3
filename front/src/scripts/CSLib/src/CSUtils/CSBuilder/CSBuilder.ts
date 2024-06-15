import * as THREE from 'three';

export function PolylinesGroup( points: THREE.Vector3[][], color: number ){
    const parentObj = new THREE.Object3D();
    const mat = new THREE.LineBasicMaterial({ linewidth: 1, color });
    for( let i = 0; i < points.length; i++ ){
        parentObj.add( _polyline( points[i], mat ) );
    }
    return { parentObj, mat };
}

function _polyline( points: THREE.Vector3[], mat: THREE.LineBasicMaterial ): THREE.Line {
    const geo = new THREE.BufferGeometry().setFromPoints( points );
    geo.computeBoundingBox();
    const origin = new THREE.Vector3();
    geo.boundingBox!.getCenter( origin );
    geo.center();
    const line = new THREE.Line( geo, mat );

    line.position.set( origin.x, origin.y, origin.z );
    return line;
}

export function PolylineRaycast( points: THREE.Vector3[], color: number, opts: { radius: number }){
    const geo1 = new THREE.BufferGeometry().setFromPoints( points );
    geo1.computeBoundingBox();
    const origin = new THREE.Vector3();
    geo1.boundingBox!.getCenter( origin );
    geo1.center();
    const mat1 = new THREE.LineBasicMaterial({ linewidth: 1, color });
    const mesh = new THREE.Line( geo1, mat1 );
    
    const isClosed = true;
    const translatedPoints = BufferAttributeToVector3( geo1 );
    // const translatedPoints = geo1.getAttribute('position')
    const curve = new THREE.CatmullRomCurve3( translatedPoints, isClosed, 'catmullrom', 0 );
    const geo2 = new THREE.TubeGeometry( curve, points.length * 10, opts.radius, 8, false );
    // geo2.translate( origin.x, origin.y, origin.z );
    const mat2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const raycastObj = new THREE.Mesh( geo2, mat2 );
    // mesh.add( raycastObj );

    // mesh.position.set( origin.x, origin.y, origin.z );
    return { origin, mesh, raycastObj, mat: mat1 };
}

export function PointRaycast( origin: THREE.Vector3, color: number, opts: { radius: number } ){
    const geo1 = new THREE.SphereGeometry( opts.radius / 2, 8, 8 );
    geo1.computeBoundingBox();
    const mat1 = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh( geo1, mat1 );

    const geo2 = new THREE.SphereGeometry( opts.radius, 8, 8 );
    const mat2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const raycastObj = new THREE.Mesh( geo2, mat2 );
    
    // mesh.add( raycastObj );
    // mesh.position.set( origin.x, origin.y, origin.z );
    
    return { origin, mesh, raycastObj, mat: mat1 };
}

export function BufferAttributeToVector3( geo: THREE.BufferGeometry ): THREE.Vector3[] {
    const positionsAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const numVertices = positionsAttr.count;
    const positions = [];
    for ( let i = 0; i < numVertices; i++ ) {
        const x = positionsAttr.getX( i );
        const y = positionsAttr.getY( i );
        const z = positionsAttr.getZ( i );
        
        positions.push( new THREE.Vector3( x, y, z ) );
    }
    return positions;
}