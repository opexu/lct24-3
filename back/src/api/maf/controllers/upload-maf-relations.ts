import utils, { parseMultipartData } from '@strapi/utils';
const { ApplicationError } = utils.errors;
import * as fs from 'fs';
import unzipper from 'unzipper';
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IAgeCategory, ICatalogDb, IEntity, IMaf, IMafDb, IProviderDb, ITerritoryTypeDb, ITitleDb } from '../../../utils/IReestr';
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
    }
}

async function _upload( filePath: string ){
    return new Promise(( resolve, reject ) => {
        const opts: IMafRelationsTransformOptions = {
            objectMode: true
        };
        const parser = new XMLParser();
        const mrt = new MafRelationsTransform( parser, opts );
        const rs = fs.createReadStream( filePath );
        mrt.on('finish', () => {
            Promise.all([
                    titleBulkSave( 'catalogs', mrt.CatalogsArr ),
                    titleBulkSave( 'providers', mrt.ProvidersArr ),
                    titleBulkSave( 'maf_types', mrt.MafTypesArr ),
                    titleBulkSave( 'territory_types', mrt.TerritoryTypesArr ),
                ])
                .then(() => { return resolve( true ) })
                .catch( reason => {
                    console.error('reject reason: ', reason );
                    return reject('Ошибка записи информации в бд');
                });
        });
        mrt.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка конвертации файла')
        })
        rs.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка чтения xlsx файла')
        })
        rs
            .pipe( unzipper.Parse() )
            .pipe( mrt )
    });
}

interface IMafRelationsTransformOptions extends TransformOptions {}

class MafRelationsTransform extends Transform {

    private readonly _catalogsSet = new Set<string>();
    private readonly _providersSet = new Set<string>();
    private readonly _mafTypesSet = new Set<string>();
    private readonly _territoryTypesSet = new Set<string>();

    constructor( 
        private readonly parser: XMLParser, opts?: IMafRelationsTransformOptions 
    ){
        super( opts );
    }

    get CatalogsArr(){ return titleDbFromSet( this._catalogsSet ); }
    get ProvidersArr(){ return titleDbFromSet( this._providersSet ); }
    get MafTypesArr(){ return titleDbFromSet( this._mafTypesSet ); }
    get TerritoryTypesArr(){ return titleDbFromSet( this._territoryTypesSet ); }

    async _transform( chunk: any, encoding: BufferEncoding, callback: TransformCallback ): Promise<void> {
        const content = await chunk.buffer();
        const jsonObj = this.parser.parse( content ) as IMafRaw;
        if( !checkCatalog( jsonObj ) ){
            callback();
            return;
        }

        const catalog = jsonObj.Catalog.catalogName;
        if( catalog ) this._catalogsSet.add( catalog );

        const provider = jsonObj.Catalog.provider;
        if( provider ) this._providersSet.add( provider );

        const mafType = jsonObj.Catalog.type;
        if( mafType ) this._mafTypesSet.add( mafType );

        const territoryTypesArr = jsonObj.Catalog.territoryType?.territoryType;
        if( territoryTypesArr && Array.isArray( territoryTypesArr ) && territoryTypesArr.length > 0 ) territoryTypesArr.forEach( t => this._territoryTypesSet.add( t ) );

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
interface IMafRaw {
    Catalog?: {
        image?: string,
        catalogName?: string,
        vendorCode?: number,
        analogSample?: string,
        sampleCode?: string,
        dimensions?: string,
        description?: string,
        price?: number,
        name?: string,
        provider?: string,
        type?: string,
        units?: string,
        typeEquipment?: string,
        safetyZones?: string,
        techDocumentation?: string,
        ageCategory?: string,
        territoryType?: { 
            territoryType?: string[]
        }
    }
}

function checkCatalog( data: IMafRaw ): boolean {
    if( !('Catalog' in data )) return false;
    else return true;
}