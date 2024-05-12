import type { IArcEntity, ICircleEntity, IDxf, IEllipseEntity, IEntity, ILineEntity, ILwpolylineEntity, IPoint, IPointEntity, IPolylineEntity, ISplineEntity } from "dxf-parser";
import * as THREE from 'three';
import bSpline from './bspline';
import { CSLineType, type CSDXFObjectType } from "../../CSObjects/CSDXFObject/ICSDXFObject";

export interface IDxfParsedObj {
    color: number;
    type: CSDXFObjectType;
    layer: string;
    lineType: CSLineType;
    points: THREE.Vector3[];
    origin: THREE.Vector3;
}

export class CSDXFParser {

    public parse( dxf: IDxf ): IDxfParsedObj[] {

        const dxfBufferGeometryArr: IDxfParsedObj[] = [];
        for ( let i = 0; i < dxf.entities.length; i++ ) {
            let points: THREE.Vector3[] = [];
            let origin = new THREE.Vector3();
            const dxfEntity = dxf.entities[ i ];
            switch ( dxfEntity.type ) {
                case 'POLYLINE': {
                    points = this._parsePolyline( dxfEntity as IPolylineEntity );
                    origin = points[ 0 ];
                    break;
                }
                case 'LWPOLYLINE': {
                    points = this._parseLwPolyline( dxfEntity as ILwpolylineEntity );
                    origin = points[ 0 ];
                    break;
                }
                case 'LINE': {
                    points = this._parseLine( dxfEntity as ILineEntity );
                    origin = points[ 0 ];
                    break;
                }
                case 'ARC':
                case 'CIRCLE': {
                    points = this._parseCircle( dxfEntity as ICircleEntity | IArcEntity );
                    origin.set(
                        ( dxfEntity as ICircleEntity ).center.x,
                        ( dxfEntity as ICircleEntity ).center.y,
                        ( dxfEntity as ICircleEntity ).center.z
                    )
                    break;
                }
                case 'ELLIPSE': {
                    points = this._parseEllipse( dxfEntity as IEllipseEntity );
                    origin = points[ 0 ];
                    break;
                }
                case 'SPLINE': {
                    points = this._parseSpline( dxfEntity as ISplineEntity );
                    origin = points[ 0 ];
                    break;
                }
                case 'POINT': {
                    points = this._parsePoint( dxfEntity as IPointEntity );
                    origin = points[ 0 ];
                    break;
                }
                default: {
                    console.log( `parser to dxf entity type ${dxfEntity.type} not implemented` );
                    continue;
                }
            }
            if( !points || points.length === 0 ) continue;
            dxfBufferGeometryArr.push({
                color: this._getColor( dxfEntity, dxf ),
                type: dxfEntity.type as CSDXFObjectType,
                layer: dxfEntity.layer,
                lineType: this._getLineType( dxfEntity, dxf ),
                points: points.map( p => new THREE.Vector3( p.x, p.z, -p.y ) ),
                origin: origin,
            });
        }

        return dxfBufferGeometryArr;
    }

    private _parsePolyline( entity: IPolylineEntity ) {
        const points = [];
        let vertex, startPoint, endPoint, bulge, i;

        if ( !entity.vertices ) {
            console.log( 'entity missing vertices.' );
            return [];
        }

        // create geometry
        for ( i = 0; i < entity.vertices.length; i++ ) {

            if ( entity.vertices[ i ].bulge ) {
                bulge = entity.vertices[ i ].bulge;
                startPoint = entity.vertices[ i ];
                endPoint = i + 1 < entity.vertices.length ? entity.vertices[ i + 1 ] : points[ 0 ];

                let bulgePoints = this._getBulgeCurvePoints( startPoint, endPoint, bulge );

                points.push.apply( points, bulgePoints );
            } else {
                vertex = entity.vertices[ i ];
                points.push( new THREE.Vector3( vertex.x, vertex.y, 0 ) );
            }

        }
        if ( entity.shape ) points.push( points[ 0 ] );
        
        return points;
    }

    private _parseLwPolyline( entity: ILwpolylineEntity ) {
        const points = [];
        let vertex, startPoint, endPoint, bulge, i;

        if ( !entity.vertices ) {
            console.log( 'entity missing vertices.' );
            return [];
        }

        // create geometry
        for ( i = 0; i < entity.vertices.length; i++ ) {

            if ( entity.vertices[ i ].bulge ) {
                bulge = entity.vertices[ i ].bulge;
                startPoint = entity.vertices[ i ];
                endPoint = i + 1 < entity.vertices.length ? entity.vertices[ i + 1 ] : points[ 0 ];

                let bulgePoints = this._getBulgeCurvePoints( startPoint, endPoint, bulge );

                points.push.apply( points, bulgePoints );
            } else {
                vertex = entity.vertices[ i ];
                points.push( new THREE.Vector3( vertex.x, vertex.y, 0 ) );
            }

        }
        if ( entity.shape ) points.push( points[ 0 ] );

        return points;
    }

    private _parseLine( entity: ILineEntity ) {
        const points = [];
        let vertex, i;

        if ( !entity.vertices ) {
            console.log( 'entity missing vertices.' );
            return [];
        }

        // create geometry
        for ( i = 0; i < entity.vertices.length; i++ ) {

            vertex = entity.vertices[ i ];
            points.push( new THREE.Vector3( vertex.x, vertex.y, 0 ) );

        }

        return points;
    }

    private _parseCircle( entity: ICircleEntity | IArcEntity ) {
        let startAngle, endAngle;
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

        const points = curve.getPoints( 32 ).map( p2 => new THREE.Vector3( p2.x, p2.y, 0 ));
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

        const points = curve.getPoints( 50 ).map( p2 => new THREE.Vector3( p2.x, p2.y, 0 ));;
        return points;

    }

    private _parseSpline( entity: ISplineEntity ) {
        if ( !entity?.controlPoints || entity.controlPoints.length === 0 ) return [];

        const points = this._getBSplinePolyline( entity.controlPoints, entity.degreeOfSplineCurve, entity.knotValues, 100 );

        return points.map( p2 => new THREE.Vector3( p2.x, p2.y, 0 ));
    }

    private _parsePoint( entity: IPointEntity ) {
        return [ new THREE.Vector3( entity.position.x, entity.position.y, entity.position.z ) ];
    }

    private _getColor( entity: IEntity, dxf: IDxf ): number {
        var color = 0x000000; //default
        if ( entity.color ) {
            color = entity.color;
        }
        else if ( dxf.tables && dxf.tables.layer && dxf.tables.layer.layers[ entity.layer ] ) {
            color = dxf.tables.layer.layers[ entity.layer ].color;
        }

        if ( color == null || color === 0xffffff ) {
            color = 0x000000;
        }
        return color;
    }

    private _getLineType( entity: IEntity, dxf: IDxf ){
        const lineType = dxf.tables.lineType.lineTypes[entity.lineType];
        if (lineType && lineType.pattern && lineType.pattern.length !== 0) {
            return CSLineType.DASHED;
        } else {
            return CSLineType.NORMAL;
        }
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

        var vertices = [];

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