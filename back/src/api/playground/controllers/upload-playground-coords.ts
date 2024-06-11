import utils, { parseMultipartData } from '@strapi/utils';
const { ApplicationError } = utils.errors;
import * as fs from 'fs';
import excel from 'xlsx-parse-stream';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IBalanceHolder, ICoords, IDistrict, IEntity, IGRBC, IMultiDimArray, IPlaygroundDb, IPoint2D, IRegion, ITitle, ITitleDb, IYardArea, IYardAreaDb } from '../../../utils/IReestr';
import { API } from '../../../utils/strapi';

export default {

    async upload( ctx ){
        if ( !ctx.is('multipart')) throw new ApplicationError('ctx is not multipart');
        const { data, files } = parseMultipartData( ctx );
        const file = files.File;
        try{
            await _upload( file.path );
            return { status: true };
        }catch(e){
            console.error(e);
            throw new ApplicationError('Ошибка сохранения файла')
        }
    },
}

async function _upload( filePath: string ){
    const yardAreas = await strapi.entityService.findMany( API.YARD_AREA ) as IEntity<IYardArea>[]

    return new Promise(( resolve, reject ) => {
        const opts: IPlaygroundCoordsTransformOptions = {
            objectMode: true,
        };
        const pct = new PlaygroundTransform( opts );
        const rs = fs.createReadStream( filePath );
        pct.on('finish', () => {
            playgroundCoorsBulkUpdate( pct.Data )
                .then(() => {
                    return resolve( true );
                })
                .catch( reason => {
                    console.error('reject reason: ', reason );
                    return reject('Ошибка сохранения файла')
                });
        });
        pct.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка конвертации файла')
        })
        rs.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка чтения xlsx файла')
        })
        rs
            .pipe( excel() )
            .pipe( pct )
    });
}

interface IPlaygroundCoordsTransformOptions extends TransformOptions {}

class PlaygroundTransform extends Transform {
    
    private _playgroundToSave: Pick<IPlaygroundDb, 'id'|'coords'|'min_max'>[] = [];
    constructor( opts?: IPlaygroundCoordsTransformOptions ){
        super( opts );
    }

    get Data(){ return this._playgroundToSave; }

    async _transform( chunk: any, encoding: BufferEncoding, callback: TransformCallback ): Promise<void> {
        const playgroundId = chunk['АСУ ОДС Идентификатор'];
        const coordsStr = chunk['Полигоны в АСУ ОДС (план-схемы)'];
        if( !playgroundId || !coordsStr ){
            callback();
            return;
        }
        const coords = parseStringToMultiDimArray( coordsStr );
        if( !coords ){
            callback();
            return;
        }
        const min_max = findMinMax( coords );

        const length = this._playgroundToSave.push({ id: typeof playgroundId === 'number' ? playgroundId : parseInt( playgroundId ), coords: JSON.stringify( coords ), min_max: JSON.stringify( min_max ) });
        if( length >= 1000 ){
            try{
                await playgroundCoorsBulkUpdate( this._playgroundToSave );
            }catch(e){
                callback(e);
            }finally{
                this._playgroundToSave = [];
                console.log('clear')
            }
        }
        callback();
    }
}

async function playgroundCoorsBulkUpdate( data: Pick<IPlaygroundDb, 'id'|'coords'|'min_max'>[] ){
    return await strapi.db.connection( 'playgrounds' )
        .insert( data )
        .onConflict([ 'id' ])
        .merge([ 'coords', 'min_max' ])
        // .whereRaw( 'playgrounds.id = excluded.id' )
        .returning([ 'id' ]);
}

function parseStringToMultiDimArray(input: string): IMultiDimArray<IPoint2D> | null {
    const cleanedInput = input.replace(/\s/g, '').replace(/\]\[/g, '],[');
    
    let parsedArray;
    try{
        parsedArray = JSON.parse( cleanedInput );
    }catch(e){
        return null;
    }
  
    function convertToIPoint2DArray(arr: any[]): IMultiDimArray<IPoint2D> {
        return arr.map((item: any) => {
            if (Array.isArray(item[0])) {
                return convertToIPoint2DArray(item);
            }else{
            return { x: item[0], y: item[1] };
            }
      });
    }
  
    return convertToIPoint2DArray(parsedArray);
  }

function findMinMax( array: IMultiDimArray<IPoint2D> ): { min: number, max: number } {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    function recursiveFind( arr: IMultiDimArray<IPoint2D> ){
        if( Array.isArray( arr ) ){
            arr.forEach( item => {
                if( Array.isArray( item ) ){
                    recursiveFind( item );
                }else{
                    if (item.x < min) min = item.x;
                    if (item.x > max) max = item.x;
                    if (item.y < min) min = item.y;
                    if (item.y > max) max = item.y;
                }
            });
        }else{
            if (arr.x < min) min = arr.x;
            if (arr.x > max) max = arr.x;
            if (arr.y < min) min = arr.y;
            if (arr.y > max) max = arr.y;
        }
    }

    recursiveFind(array);
    return { min, max };
}