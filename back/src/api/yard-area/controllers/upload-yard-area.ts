import utils, { parseMultipartData } from '@strapi/utils';
const { ApplicationError } = utils.errors;
import * as fs from 'fs';
import excel from 'xlsx-parse-stream';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IBalanceHolder, IDistrict, IEntity, IGRBC, IRegion, ITitle, ITitleDb, IYardAreaDb } from '../../../utils/IReestr';
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
    const [ balanceHolders, regions, grbcs, districts ] = await Promise.all([
        strapi.entityService.findMany( API.BALANCE_HOLDER ),
        strapi.entityService.findMany( API.REGION ),
        strapi.entityService.findMany( API.GRBC ),
        strapi.entityService.findMany( API.DISTRICT ),
    ]) as [ IEntity<IBalanceHolder>[], IEntity<IRegion>[], IEntity<IGRBC>[], IEntity<IDistrict>[] ]

    return new Promise(( resolve, reject ) => {
        const opts: IYardAreaTransformOptions = {
            balanceHolders, regions, grbcs, districts,
            objectMode: true,
        };
        const yat = new YardAreaTransform( opts );
        const rs = fs.createReadStream( filePath );
        yat.on('finish', () => {
            yardAreaBulkSave( yat.Data )
                .then(( compareArr: { id: number }[] ) => {
                    Promise.all([
                        updateRelation( compareArr, yat.BalanceHoldersMap, 'yard_areas_balance_holder_links', 'yard_area_id', 'balance_holder_id' ),
                        updateRelation( compareArr, yat.RegionsMap, 'yard_areas_region_links', 'yard_area_id', 'region_id' ),
                        updateRelation( compareArr, yat.GRBCsMap, 'yard_areas_grbc_links', 'yard_area_id', 'grbc_id' ),
                        updateRelation( compareArr, yat.DistrictsMap, 'yard_areas_district_links', 'yard_area_id', 'district_id' )
                    ]).then(() => {
                        return resolve( true );
                    })
                })
                .catch( reason => {
                    console.error('reject reason: ', reason );
                    return reject('Ошибка сохранения файла')
                });
        });
        yat.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка конвертации файла')
        })
        rs.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка чтения xlsx файла')
        })
        rs
            .pipe( excel() )
            .pipe( yat )
    });
}

interface IYardAreaTransformOptions extends TransformOptions {
    balanceHolders: IEntity<IBalanceHolder>[],
    regions: IEntity<IRegion>[],
    grbcs: IEntity<IGRBC>[],
    districts: IEntity<IDistrict>[],
}

class YardAreaTransform extends Transform {

    private _yardAreaToSave: IYardAreaDb[] = [];
    private readonly _balanceHolders: IEntity<IBalanceHolder>[];
    private readonly _regions: IEntity<IRegion>[];
    private readonly _grbcs: IEntity<IGRBC>[];
    private readonly _districts: IEntity<IDistrict>[];

    private readonly _balanceHoldersMap: Map<number, number> = new Map();
    private readonly _regionsMap: Map<number, number> = new Map();
    private readonly _grbcsMap: Map<number, number> = new Map();
    private readonly _disrictsMap: Map<number, number> = new Map();

    constructor( opts?: IYardAreaTransformOptions ){
        super( opts );
        this._balanceHolders = opts.balanceHolders;
        this._regions = opts.regions;
        this._grbcs = opts.grbcs;
        this._districts = opts.districts;
    }

    get Data(){ return this._yardAreaToSave; }
    get BalanceHoldersMap(){ return this._balanceHoldersMap; }
    get RegionsMap(){ return this._regionsMap; }
    get GRBCsMap(){ return this._grbcsMap; }
    get DistrictsMap(){ return this._disrictsMap; }

    async _transform( chunk: any, encoding: BufferEncoding, callback: TransformCallback ): Promise<void> {
        const yard = toYardDb( chunk );
        if( !yard ) {
            callback();
            return;
        }
        const balanceHolder = checkTitle( this._balanceHolders, chunk['Балансодержатель'] );
        const region = checkTitle( this._regions, chunk['Район'] );
        const grbc = checkTitle( this._grbcs, chunk['ГРБС'] );
        const district = checkTitle( this._districts, chunk['Округ'] );

        if( balanceHolder ) this._balanceHoldersMap.set( yard.id, balanceHolder.id );
        if( region ) this._regionsMap.set( yard.id, region.id );
        if( grbc ) this._grbcsMap.set( yard.id, grbc.id );
        if( district ) this._disrictsMap.set( yard.id, district.id );

        const length = this._yardAreaToSave.push( yard );
        if( length >= 1000 ){
            try{
                const compareArr: { id: number }[] = await yardAreaBulkSave( this._yardAreaToSave );
                await Promise.all([
                    updateRelation( compareArr, this._balanceHoldersMap, 'yard_areas_balance_holder_links', 'yard_area_id', 'balance_holder_id' ),
                    updateRelation( compareArr, this._regionsMap, 'yard_areas_region_links', 'yard_area_id', 'region_id' ),
                    updateRelation( compareArr, this._grbcsMap, 'yard_areas_grbc_links', 'yard_area_id', 'grbc_id' ),
                    updateRelation( compareArr, this._disrictsMap, 'yard_areas_district_links', 'yard_area_id', 'district_id' )
                ]);
            }catch(e){
                callback(e);
            }finally{
                this._yardAreaToSave = [];
                this._balanceHoldersMap.clear();
                this._regionsMap.clear();
                this._grbcsMap.clear();
                this._disrictsMap.clear();
                console.log('clear');
            }
        }
        callback();
    }
}

async function yardAreaBulkSave( data: IYardAreaDb[] ){
    return await strapi.db.connection( 'yard_areas' )
        .insert( data )
        .onConflict([ 'id' ])
        .merge()
        .whereRaw( 'yard_areas.id != excluded.id' )
        .returning([ 'id' ]);
}

function checkTitle<T extends IEntity<ITitle>>( arr: T[], title?: string ): T | null {
    const entity = arr.find( a => a.Title === title );
    return entity ? entity : null;
}

function toYardDb( any: any ): IYardAreaDb | null {
    const id = any['Идентификатор родительского объекта'];
    const title = any['Наименование'];
    const square = any['Общая площадь, кв.м'];
    return id && title && square ? { id: typeof id === 'number' ? id : parseInt( id ), title, square: typeof square === 'number' ? square : parseFloat( square ) } : null;
}

async function updateRelation( compareArr: { id: number }[], map: Map<number,number>, collection: string, key1: string, key2: string ){
    const data = [];
    compareArr.forEach( c => {
        if( map.has( c.id ) ){
            const otherId = map.get( c.id );
            data.push({
                [key1]: c.id,
                [key2]: otherId,
            })
        }
    })

    await strapi.db.connection( collection )
        .insert( data )
        .whereRaw( `${collection}.${key1} != excluded.${key1}` )
        .andWhereRaw( `${collection}.${key2} != excluded.${key2}` )
}

