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
    const playgrounds = await strapi.entityService.findMany( API.PLAYGROUND ) as IEntity<IPlayground>[];

    console.log('playgrounds.length: ', playgrounds.length);

    return new Promise(( resolve, reject ) => {
        const opts: IPlaygroundFundingLimitsTransformOptions = {
            playgrounds,
            objectMode: true,
        };
        const pmt = new PlaygroundTransform( opts );
        const rs = fs.createReadStream( filePath );
        pmt.on('finish', () => {
            updateMany( pmt.Data, 'playgrounds', 'id' )
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

interface IPlaygroundFundingLimitsTransformOptions extends TransformOptions {
    playgrounds: IEntity<IPlayground>[],
}

class PlaygroundTransform extends Transform {

    private readonly _playgroundsIds: Set<number>;
    private readonly _playgroundsIdsToUpdate: Set<number> = new Set();

    private _dataToSave: { id: number, funding_limit: number }[] = [];

    constructor( opts: IPlaygroundFundingLimitsTransformOptions ){
        super( opts );
        this._playgroundsIds = new Set( opts.playgrounds.map( p => p.id ) );
        console.log('Array.from( this._playgroundsIds.values())', Array.from( this._playgroundsIds.values()));
    }

    get Data(){ return this._dataToSave; }

    async _transform( chunk: any, encoding: BufferEncoding, callback: TransformCallback ): Promise<void> {
        let playgroundId = chunk['Идентификатор родительского объекта'];
        let fundingLimit = chunk['Лимит финансирования (у.е.)'];
        console.log('playgroundId: ', playgroundId, ', fundingLimit: ', fundingLimit )
        if( !playgroundId || !fundingLimit ){
            callback();
            return;
        }

        playgroundId = typeof playgroundId === 'number' ? playgroundId : parseInt( playgroundId );
        fundingLimit = typeof fundingLimit === 'number' ? fundingLimit : parseFloat( fundingLimit );

        if( !this._playgroundsIds.has( playgroundId ) ){
            callback();
            return;
        }
        
        if( this._playgroundsIdsToUpdate.has( playgroundId ) ){
            callback();
            return;
        }else{
            this._playgroundsIdsToUpdate.add( playgroundId );
        }

        const length = this._dataToSave.push({
            id: playgroundId,
            funding_limit: fundingLimit,
        });

        if( length >= 1000 ){
            try{
                await updateMany( this._dataToSave, 'playgrounds', 'id' );
            }catch(e){
                callback(e);
            }finally{
                this._dataToSave = [];
            }
        }

        callback();
    }
}

async function updateMany( data: { id: number, funding_limit: number }[], collection: string, key1: string ){
    await strapi.db.connection( collection )
        .insert( data )
        .onConflict([ 'id' ])
        .merge([ 'funding_limit' ])
        .whereRaw( `${collection}.${key1} != excluded.${key1}` )
}
