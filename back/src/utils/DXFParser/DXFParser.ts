import type { IArcEntity, ICircleEntity, IDxf, IEllipseEntity, IEntity, ILineEntity, ILwpolylineEntity, IPoint, IPointEntity, IPolylineEntity, ISplineEntity, IVertexEntity } from "dxf-parser";
import * as THREE from 'three';
import bSpline from './bspline';
import { IVertex } from "dxf-parser/dist/entities/lwpolyline";

export interface IDxfParsedMafObj {
    id: number;
    borderPoints: IPoint[];
    geoPoints: IPoint[][];
    minMax: { min: IPoint, max: IPoint }
}

export class DXFParser {

    public parse( dxf: IDxf ): Omit<IDxfParsedMafObj,'id'> {

        let tempBorderPoints: IPoint[] = [];
        const tempGeoPoints: IPoint[][] = [];
        let minMax: { min: IPoint, max: IPoint };
        let translateMatrix: THREE.Matrix4;

        for ( let i = 0; i < dxf.entities.length; i++ ) {
            const dxfEntity = dxf.entities[ i ];
            const points = this._parseObj( dxfEntity );
            switch( dxfEntity.layer ){
                case '0': {
                    tempGeoPoints.push( points )
                    break;
                }
                case '1': {
                    if( minMax && tempBorderPoints.length !== 0 ) break;
                    tempBorderPoints = points;
                    minMax = this._calcMinMax( tempBorderPoints );
                    translateMatrix = this._calcTranslateMatrix( minMax );
                    break;
                }
            }
        }

        const borderPoints = this._centerPoints( tempBorderPoints, translateMatrix ) as IPoint[];
        const geoPoints = this._centerPoints( tempGeoPoints, translateMatrix ) as IPoint[][];

        return {
            geoPoints,
            borderPoints,
            minMax,
        }
    }

    private _calcMinMax( pointsArr: IPoint[] ){
        let min: IPoint = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, z: 0 }
        let max: IPoint = { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY, z: 0 }
        pointsArr.forEach( p => {
            if( p.x < min.x ) min.x = p.x;
            if( p.y < min.y ) min.y = p.y;
            if( p.x > max.x ) max.x = p.x;
            if( p.y > max.y ) max.y = p.y;
        });
        return { min, max };
    }

    private _calcTranslateMatrix( minmax: { min: IPoint, max: IPoint } ): THREE.Matrix4 {
        const box3 = new THREE.Box3( new THREE.Vector3( minmax.min.x, 0, minmax.min.y ), new THREE.Vector3( minmax.max.x, 0, minmax.max.y ) );
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
        return translationMatrix;
    }

    private _centerPoints( arr: IPoint[][] | IPoint[], matrix: THREE.Matrix4 ): IPoint[][] | IPoint[] {
        if( this._IsMultiArr( arr ) ){
            const vectorArr: IPoint[][] = [];
            arr.forEach( pointsArr => {
                const vArr: IPoint[] = [];
                pointsArr.forEach( p => {
                    const v = new THREE.Vector3( p.x, 0, p.y );
                    v.applyMatrix4( matrix );
                    vArr.push( v );
                });
                vectorArr.push( vArr );
            });
            return vectorArr;
        }else{
            const vectorArr: IPoint[] = [];
            arr.forEach( p => {
                const v = new THREE.Vector3( p.x, 0, p.y );
                v.applyMatrix4( matrix );
                vectorArr.push( v );
            });
            return vectorArr;
        }
        
    }

    private _IsMultiArr( arr: IPoint[][] | IPoint[] ): arr is IPoint[][]{
        if( Array.isArray( arr[0] ) ) return true;
        else return false;
    }
    private _parseObj( dxfEntity: IEntity ): IPoint[] {
        let points: IPoint[] = [];
        switch ( dxfEntity.type ) {
            case 'POLYLINE': {
                points = this._parsePolyline( dxfEntity as IPolylineEntity );
                break;
            }
            case 'LWPOLYLINE': {
                points = this._parseLwPolyline( dxfEntity as ILwpolylineEntity );
                break;
            }
            case 'LINE': {
                points = this._parseLine( dxfEntity as ILineEntity );
                break;
            }
            case 'ARC':
            case 'CIRCLE': {
                points = this._parseCircle( dxfEntity as ICircleEntity | IArcEntity );
                break;
            }
            case 'ELLIPSE': {
                points = this._parseEllipse( dxfEntity as IEllipseEntity );
                break;
            }
            case 'SPLINE': {
                points = this._parseSpline( dxfEntity as ISplineEntity );
                break;
            }
            // case 'POINT': {
            //     points = this._parsePoint( dxfEntity as IPointEntity );
            //     break;
            // }
            default: {
                console.log( `parser to dxf entity type ${dxfEntity.type} not implemented` );
            }
        }
        return points;
    }

    private _parsePolyline( entity: IPolylineEntity ): IPoint[] {
        const points: IPoint[] = [];
        let vertex: IVertexEntity;
        let startPoint: IPoint;
        let endPoint: IPoint;
        let bulge;

        if ( !entity.vertices ) {
            console.log( 'entity missing vertices.' );
            return [];
        }

        // create geometry
        for ( let i = 0; i < entity.vertices.length; i++ ) {

            if ( entity.vertices[ i ].bulge ) {
                bulge = entity.vertices[ i ].bulge;
                startPoint = entity.vertices[ i ];
                endPoint = i + 1 < entity.vertices.length ? entity.vertices[ i + 1 ] : points[ 0 ];

                let bulgePoints = this._getBulgeCurvePoints( startPoint, endPoint, bulge );

                points.push.apply( points, bulgePoints );
            } else {
                vertex = entity.vertices[ i ];
                points.push({ x: vertex.x, y: vertex.y, z: 0 });
            }

        }
        if ( entity.shape ) points.push( points[ 0 ] );
        
        return points;
    }

    private _parseLwPolyline( entity: ILwpolylineEntity ) {
        const points: IPoint[] = [];
        let vertex: IVertex;
        let startPoint: IPoint;
        let endPoint: IPoint;
        let bulge;

        if ( !entity.vertices ) {
            console.log( 'entity missing vertices.' );
            return [];
        }

        // create geometry
        for ( let i = 0; i < entity.vertices.length; i++ ) {

            if ( entity.vertices[ i ].bulge ) {
                bulge = entity.vertices[ i ].bulge;
                startPoint = entity.vertices[ i ];
                endPoint = i + 1 < entity.vertices.length ? entity.vertices[ i + 1 ] : points[ 0 ];

                let bulgePoints = this._getBulgeCurvePoints( startPoint, endPoint, bulge );

                points.push.apply( points, bulgePoints );
            } else {
                vertex = entity.vertices[ i ];
                points.push({ x: vertex.x, y: vertex.y, z: 0 });
            }

        }
        if ( entity.shape ) points.push( points[ 0 ] );

        return points;
    }

    private _parseLine( entity: ILineEntity ) {
        const points: IPoint[] = [];
        let vertex: IPoint;

        if ( !entity.vertices ) {
            console.log( 'entity missing vertices.' );
            return [];
        }

        // create geometry
        for ( let i = 0; i < entity.vertices.length; i++ ) {

            vertex = entity.vertices[ i ];
            points.push({ x: vertex.x, y: vertex.y, z: 0 });

        }

        return points;
    }

    private _parseCircle( entity: ICircleEntity | IArcEntity ) {
        let startAngle: number, endAngle: number;
        if ( entity.type === 'CIRCLE' ) {
            startAngle = entity.startAngle || 0;
            endAngle = startAngle + 2 * Math.PI;
        } else {
            startAngle = entity.startAngle;
            endAngle = entity.endAngle;
        }

        const curve = new THREE.ArcCurve(
            0, 0,
            entity.radius,
            startAngle,
            endAngle);

        const points = curve.getPoints( 32 ).map( p2 => ({ x: p2.x, y: p2.y, z: 0 }) );
        return points;
    }

    private _parseEllipse( entity: IEllipseEntity ) {
        const xrad = Math.sqrt( Math.pow( entity.majorAxisEndPoint.x, 2 ) + Math.pow( entity.majorAxisEndPoint.y, 2 ) );
        const yrad = xrad * entity.axisRatio;
        const rotation = Math.atan2( entity.majorAxisEndPoint.y, entity.majorAxisEndPoint.x );

        const curve = new THREE.EllipseCurve(
            entity.center.x, entity.center.y,
            xrad, yrad,
            entity.startAngle, entity.endAngle,
            false, // Always counterclockwise
            rotation
        );

        const points = curve.getPoints( 50 ).map( p2 => ({ x: p2.x, y: p2.y, z: 0 }) );
        return points;

    }

    private _parseSpline( entity: ISplineEntity ) {
        if ( !entity?.controlPoints || entity.controlPoints.length === 0 ) return [];

        const points = this._getBSplinePolyline( entity.controlPoints, entity.degreeOfSplineCurve, entity.knotValues, 100 );

        return points.map( p2 => ({ x: p2.x, y: p2.y, z: 0 }) );
    }

    private _parsePoint( entity: IPointEntity ) {
        return [ new THREE.Vector3( entity.position.x, entity.position.y, entity.position.z ) ];
    }

    private _getBSplinePolyline( controlPoints: IPoint[], degree: number, knots: number[], interpolationsPerSplineSegment: number, weights?: number[] ) {
        const polyline = []
        const controlPointsForLib = controlPoints.map( function ( p ) {
            return [ p.x, p.y ]
        } )

        const segmentTs = [ knots[ degree ] ]
        const domain = [ knots[ degree ], knots[ knots.length - 1 - degree ] ]

        for ( let k = degree + 1; k < knots.length - degree; ++k ) {
            if ( segmentTs[ segmentTs.length - 1 ] !== knots[ k ] ) {
                segmentTs.push( knots[ k ] )
            }
        }

        interpolationsPerSplineSegment = interpolationsPerSplineSegment || 25
        for ( let i = 1; i < segmentTs.length; ++i ) {
            const uMin = segmentTs[ i - 1 ]
            const uMax = segmentTs[ i ]
            for ( let k = 0; k <= interpolationsPerSplineSegment; ++k ) {
                const u = k / interpolationsPerSplineSegment * ( uMax - uMin ) + uMin
                // Clamp t to 0, 1 to handle numerical precision issues
                let t = ( u - domain[ 0 ] ) / ( domain[ 1 ] - domain[ 0 ] )
                t = Math.max( t, 0 )
                t = Math.min( t, 1 )
                const p = bSpline( t, degree, controlPointsForLib, knots, weights )
                polyline.push( new THREE.Vector2( p[ 0 ], p[ 1 ] ) );
            }
        }
        return polyline;
    }

    private _getBulgeCurvePoints( startPoint: IPoint, endPoint: IPoint, bulge: number, segments?: number ) {

        var vertex, i,
            center, p0, p1, angle,
            radius, startAngle,
            thetaAngle;

        var obj = {} as { [ key: string ]: any };
        obj.startPoint = p0 = startPoint ? new THREE.Vector2( startPoint.x, startPoint.y ) : new THREE.Vector2( 0, 0 );
        obj.endPoint = p1 = endPoint ? new THREE.Vector2( endPoint.x, endPoint.y ) : new THREE.Vector2( 1, 0 );
        obj.bulge = bulge = bulge || 1;

        angle = 4 * Math.atan( bulge );
        radius = p0.distanceTo( p1 ) / 2 / Math.sin( angle / 2 );
        center = polar( startPoint, radius, angle2( p0, p1 ) + ( Math.PI / 2 - angle / 2 ) );

        obj.segments = segments = segments || Math.max( Math.abs( Math.ceil( angle / ( Math.PI / 18 ) ) ), 6 ); // By default want a segment roughly every 10 degrees
        startAngle = angle2( center, p0 );
        thetaAngle = angle / segments;

        var vertices: IPoint[] = [];

        vertices.push( new THREE.Vector3( p0.x, p0.y, 0 ) );

        for ( i = 1; i <= segments - 1; i++ ) {
            vertex = polar( center, Math.abs( radius ), startAngle + thetaAngle * i );
            vertices.push( new THREE.Vector3( vertex.x, vertex.y, 0 ) );
        }

        return vertices;

        function polar( point: Pick<THREE.Vector2, 'x'|'y'>, distance: number, angle: number ) {
            return {
                x: point.x + distance * Math.cos( angle ),
                y: point.y + distance * Math.sin( angle ),
            };
        };

        function angle2( p1: Pick<THREE.Vector2, 'x'|'y'>, p2: Pick<THREE.Vector2, 'x'|'y'> ) {
            var v1 = new THREE.Vector2( p1.x, p1.y );
            var v2 = new THREE.Vector2( p2.x, p2.y );
            v2.sub( v1 ); // sets v2 to be our chord
            v2.normalize();
            if ( v2.y < 0 ) return -Math.acos( v2.x );
            return Math.acos( v2.x );
        }
    };
}