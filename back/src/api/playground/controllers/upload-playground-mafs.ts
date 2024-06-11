import utils, { parseMultipartData } from '@strapi/utils';
const { ApplicationError } = utils.errors;
import * as fs from 'fs';
import excel from 'xlsx-parse-stream';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import type { IEntity, IMaf, IPlayground } from '../../../utils/IReestr';
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
    // const mafs = await strapi.entityService.findMany( API.MAF ) as IEntity<IMaf>[];
    // const playgrounds = await strapi.entityService.findMany( API.PLAYGROUND ) as IEntity<IPlayground>[];
    const [ mafs, playgrounds ] = await Promise.all([
        strapi.entityService.findMany( API.MAF ),
        strapi.entityService.findMany( API.PLAYGROUND )
    ]) as [ IEntity<IMaf>[], IEntity<IPlayground>[] ]

    console.log('mafs.length: ', mafs.length);
    console.log('playgrounds.length: ', playgrounds.length);

    return new Promise(( resolve, reject ) => {
        const opts: IPlaygroundMafsTransformOptions = {
            mafs, playgrounds,
            objectMode: true,
        };
        const pmt = new PlaygroundTransform( opts );
        const rs = fs.createReadStream( filePath );
        pmt.on('finish', () => {
            updateManyRelation( pmt.Data, 'playgrounds_mafs_links', 'maf_id', 'playground_id' )
                .then(() => {
                    return resolve( true );
                })
                .catch( reason => {
                    console.error('reject reason: ', reason );
                    return reject('Ошибка сохранения файла')
                });
        });
        pmt.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка конвертации файла')
        })
        rs.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка чтения xlsx файла')
        })
        rs
            .pipe( excel() )
            .pipe( pmt )
    });
}

interface IPlaygroundMafsTransformOptions extends TransformOptions {
    mafs: IEntity<IMaf>[],
    playgrounds: IEntity<IPlayground>[],
}

class PlaygroundTransform extends Transform {

    private readonly _mafsIds: Set<number>;
    private readonly _playgroundsIds: Set<number>;

    private _dataToSave: { maf_id: number, playground_id: number, maf_order: number }[] = [];

    constructor( opts: IPlaygroundMafsTransformOptions ){
        super( opts );
        this._mafsIds = new Set( opts.mafs.map( m => m.id ) );
        this._playgroundsIds = new Set( opts.playgrounds.map( p => p.id ) );
        console.log('Array.from( this._mafsIds.values())', Array.from( this._mafsIds.values()));
        console.log('Array.from( this._playgroundsIds.values())', Array.from( this._playgroundsIds.values()));
    }

    get Data(){ return this._dataToSave; }

    async _transform( chunk: any, encoding: BufferEncoding, callback: TransformCallback ): Promise<void> {
        const mafId = typeof chunk['ID МАФ'] === 'number' ? chunk['ID МАФ'] : parseInt( chunk['ID МАФ'] ) || null;
        const playgroundId = extractID( chunk['Принадлежность элемента к зоне территории'] );
        // console.log('mafId: ', mafId, ', playgroundId: ', playgroundId )
        if( !mafId || !playgroundId ){
            callback();
            return;
        }

        if( !this._playgroundsIds.has( playgroundId ) ){
            callback();
            return;
        }

        if( !this._mafsIds.has( mafId ) ){
            callback();
            return;
        }

        
        const length = this._dataToSave.push({
            maf_id: mafId,
            playground_id: playgroundId,
            maf_order: 1.0,
        });

        if( length >= 1000 ){
            try{
                await updateManyRelation( this._dataToSave, 'playgrounds_mafs_links', 'maf_id', 'playground_id' );
            }catch(e){
                callback(e);
            }finally{
                this._dataToSave = [];
            }
        }

        callback();
    }
}

function extractID( str?: any ): number {
    if( !str || typeof str !== 'string' ) return null;
    const match = str.match(/ID\s*=\s*(\d+)/);
    return match ? parseInt( match[1] ) : null;
}

async function updateManyRelation( data: { maf_id: number, playground_id: number, maf_order: number }[], collection: string, key1: string, key2: string ){
    await strapi.db.connection( collection )
        .insert( data )
        .whereRaw( `${collection}.${key1} != excluded.${key1}` )
        .andWhereRaw( `${collection}.${key2} != excluded.${key2}` )
}
