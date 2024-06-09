import utils, { parseMultipartData } from '@strapi/utils';
const { ApplicationError } = utils.errors;
import * as fs from 'fs';
import excel from 'xlsx-parse-stream';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IBalanceHolder, IDistrict, IEntity, IGRBC, IPlaygroundDb, IRegion, ITitle, ITitleDb, IYardArea, IYardAreaDb } from '../../../utils/IReestr';
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
        const opts: IPlaygroundTransformOptions = {
            yardAreas,
            objectMode: true,
        };
        const pt = new PlaygroundTransform( opts );
        const rs = fs.createReadStream( filePath );
        pt.on('finish', () => {
            playgroundBulkSave( pt.Data )
                .then(( compareArr: { id: number }[] ) => {
                    updateYardAreaRelation( compareArr, pt.YardAreasMap )
                        .then(() => {
                            return resolve( true );
                        })
                })
                .catch( reason => {
                    console.error('reject reason: ', reason );
                    return reject('Ошибка сохранения файла')
                });
        });
        pt.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка конвертации файла')
        })
        rs.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка чтения xlsx файла')
        })
        rs
            .pipe( excel() )
            .pipe( pt )
    });
}

interface IPlaygroundTransformOptions extends TransformOptions {
    yardAreas: IEntity<IYardArea>[],
}

class PlaygroundTransform extends Transform {

    private _playgroundToSave: IPlaygroundDb[] = [];
    private readonly _yardAreas: IEntity<IYardArea>[] = [];

    private readonly _yardAreasMap: Map<number, number> = new Map();

    constructor( opts?: IPlaygroundTransformOptions ){
        super( opts );
        this._yardAreas = opts.yardAreas;
    }

    get Data(){ return this._playgroundToSave; }
    get YardAreasMap(){ return this._yardAreasMap; }

    async _transform( chunk: any, encoding: BufferEncoding, callback: TransformCallback ): Promise<void> {
        const playground = toPlaygroundDb( chunk );
        if( !playground ){
            callback();
            return;
        }

        const yardAreaId = chunk['Идентификатор родительского объекта'];
        const yardArea = checkYardArea( this._yardAreas, typeof yardAreaId === 'number' ? yardAreaId : parseInt( yardAreaId ) );
        if( yardArea ) this._yardAreasMap.set( playground.id, yardArea.id );

        const length = this._playgroundToSave.push( playground );
        if( length >= 1000 ){
            try{
                const compareArr: { id: number }[] = await playgroundBulkSave( this._playgroundToSave );
                await updateYardAreaRelation( compareArr, this._yardAreasMap );
            }catch(e){
                callback(e);
            }finally{
                this._playgroundToSave = [];
                this._yardAreasMap.clear();
                console.log('clear');
            }
        }
        callback();
    }
}

async function playgroundBulkSave( data: IPlaygroundDb[] ){
    return await strapi.db.connection( 'playgrounds' )
        .insert( data )
        .onConflict([ 'id' ])
        .merge()
        .whereRaw( 'playgrounds.id != excluded.id' )
        .returning([ 'id' ]);
}

function toPlaygroundDb( any: any ): IPlaygroundDb | null {
    const id = any['ID плоскостного сооружения'];
    const status = any['Статус'];
    const type = any['Тип (назначение)'];
    const type_comment = any['Уточнение'];
    const square = any['Общая площадь, кв.м'];
    return id && type && square ? { id: typeof id === 'number' ? id : parseInt( id ), status, type, type_comment, square: typeof square === 'number' ? square : parseFloat( square ) } : null
}

function checkYardArea( arr: IEntity<IYardArea>[], id: number ): IEntity<IYardArea> | null {
    const entity = arr.find( a => a.id === id );
    return entity ? entity : null;
}

async function updateYardAreaRelation( compareArr: { id: number }[], map: Map<number,number> ){
    const data = [];
    compareArr.forEach( c => {
        if( map.has( c.id ) ){
            const otherId = map.get( c.id );
            data.push({
                'playground_id': c.id,
                'yard_area_id': otherId,
            });
        }
    });

    await strapi.db.connection( 'playgrounds_yard_area_links' )
        .insert( data )
        .whereRaw( 'playgrounds_yard_area_links.playground_id != excluded.playground_id' )
        .andWhereRaw( 'playgrounds_yard_area_links.yard_area_id != excluded.yard_area_id' )
}