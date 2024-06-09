import utils, { parseMultipartData } from '@strapi/utils';
const { ApplicationError } = utils.errors;
import * as fs from 'fs';
import excel from 'xlsx-parse-stream';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import { ITitleDb } from '../../../utils/IReestr';

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
    return new Promise(( resolve, reject ) => {
        const opts: IBalanceHolderTransformOptions = {
            fields: [ 'Балансодержатель', 'Район', 'ГРБС', 'Округ' ],
            objectMode: true
        };
        const bht = new BalanceHolderTransform( opts );
        const rs = fs.createReadStream( filePath );
        bht.on('finish', () => {
            Promise.all([
                    titleBulkSave('balance_holders', bht.BalanceHoldersArr ),
                    titleBulkSave('regions', bht.RegionsArr ),
                    titleBulkSave('grbcs', bht.GRBCsArr ),
                    titleBulkSave('districts', bht.DistrictsArr ),
                ])
                .then(() => { return resolve( true ) })
                .catch( reason => {
                    console.error('reject reason: ', reason );
                    return reject('Ошибка записи информации в бд');
                });
        });
        bht.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка конвертации файла')
        })
        rs.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка чтения xlsx файла')
        })
        rs
            .pipe( excel() )
            .pipe( bht )
    });
}

interface IBalanceHolderTransformOptions extends TransformOptions {
    fields: string[];
}

class BalanceHolderTransform extends Transform {

    private readonly _fields: string[];

    private readonly _balanceHolderSet = new Set<string>();
    private readonly _districtSet = new Set<string>();
    private readonly _regionSet = new Set<string>();
    private readonly _grbcSet = new Set<string>();

    constructor( opts?: IBalanceHolderTransformOptions ){
        super( opts );
        this._fields = opts.fields;
    }

    get BalanceHoldersArr(){ return titleDbFromSet( this._balanceHolderSet ); }
    get DistrictsArr(){ return titleDbFromSet( this._districtSet ); }
    get RegionsArr(){ return titleDbFromSet( this._regionSet ); }
    get GRBCsArr(){ return titleDbFromSet( this._grbcSet ); }

    async _transform( chunk: any, encoding: BufferEncoding, callback: TransformCallback ): Promise<void> {
        this._fields.forEach( field => {
            const value = chunk[ field ];
            if( !value ) return;
            switch( field ){
                case 'Балансодержатель': { this._balanceHolderSet.add( value ); break; }
                case 'Район': { this._regionSet.add( value ); break; }
                case 'ГРБС': { this._grbcSet.add( value ); break; }
                case 'Округ': { this._districtSet.add( value ); break; }
            }
        });
        
        callback();
    }
}

function titleDbFromSet( set: Set<string> ){
    return Array.from( set.values(), v => ({ title: v }) );
}
async function titleBulkSave( collection: string, data: ITitleDb[] ){
    // await strapi.db.query("api::maf.maf").createMany({ data });
    return await strapi.db.connection( collection )
        .insert( data )
        .onConflict([ 'title' ])
        .merge()
        .whereRaw( `${collection}.title != excluded.title` )
        .returning(['id', 'title']);
}