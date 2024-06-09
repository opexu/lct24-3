import utils, { parseMultipartData } from '@strapi/utils';
const { ApplicationError } = utils.errors;
import * as fs from 'fs';
import unzipper from 'unzipper';
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IAgeCategory, ICatalog, ICatalogDb, IEntity, IMaf, IMafDb, IMafType, IProvider, IProviderDb, ITerritoryType, ITerritoryTypeDb, ITitle } from '../../../utils/IReestr';
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

async function _upload( filePath ){
    const [ agesCategories, catalogs, providers, mafTypes, territoryTypes ] = await Promise.all([
        strapi.entityService.findMany( API.AGE_CATEGORY ),
        strapi.entityService.findMany( API.CATALOG ),
        strapi.entityService.findMany( API.PROVIDER ),
        strapi.entityService.findMany( API.MAF_TYPE ),
        strapi.entityService.findMany( API.TERRITORY_TYPE ),
    ]) as [ IEntity<IAgeCategory>[], IEntity<ICatalog>[], IEntity<IProvider>[], IEntity<IMafType>[], IEntity<ITerritoryType>[] ]

    return new Promise(( resolve, reject ) => {

        const opts: IMafTransformOptions = {
            agesCategories, catalogs, providers, mafTypes, territoryTypes,
            objectMode: true
        };
        const parser = new XMLParser();
        const mt = new MafTransform( parser, opts );
        const rs = fs.createReadStream( filePath );
        mt.on('finish', () => {
            mafBulkSave( mt.MafData )
                .then(( compareArr: { id: number, vendor_code: string }[] ) => {
                    Promise.all([
                        updateManyRelation( compareArr, mt.AgeCategoriesMap, 'mafs_age_categories_links', 'maf_id', 'age_category_id', 'age_category_order' ),
                        updateManyRelation( compareArr, mt.TerritoryTypesMap, 'mafs_territory_types_links', 'maf_id', 'territory_type_id', 'territory_type_order' ),
                        updateOneRelation( compareArr, mt.CatalogsMap, 'mafs_catalog_links', 'maf_id', 'catalog_id' ),
                        updateOneRelation( compareArr, mt.ProvidersMap, 'mafs_provider_links', 'maf_id', 'provider_id' ),
                        updateOneRelation( compareArr, mt.MafTypesMap, 'mafs_maf_type_links', 'maf_id', 'maf_type_id' ),
                    ]).then(() => {
                        return resolve( true );
                    })
                })
                .catch( reason => {
                    console.error('reject reason: ', reason );
                    return reject('Ошибка сохранения файла')
                });
        });
        mt.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка конвертации файла')
        })
        rs.on('error', ( err ) => {
            console.error( err );
            return reject('Ошибка чтения zip файла')
        })
        rs  
            .pipe( unzipper.Parse() )
            .pipe( mt )
    })
}

interface IMafTransformOptions extends TransformOptions {
    agesCategories: IEntity<IAgeCategory>[];
    catalogs: IEntity<ICatalog>[], 
    providers: IEntity<IProvider>[], 
    mafTypes: IEntity<IMafType>[], 
    territoryTypes: IEntity<ITerritoryType>[],
}

class MafTransform extends Transform {
    
    private mafDataToSave: IMafDb[] = [];
    private readonly _ageCategories: IEntity<IAgeCategory>[];
    private readonly _catalogs: IEntity<ICatalog>[];
    private readonly _providers: IEntity<IProvider>[];
    private readonly _mafTypes: IEntity<IMafType>[];
    private readonly _territoryTypes: IEntity<ITerritoryType>[];

    private readonly _ageCategoriesMap: Map<number, number[]> = new Map();
    private readonly _catalogsMap: Map<number, number> = new Map();
    private readonly _providersMap: Map<number, number> = new Map();
    private readonly _mafTypesMap: Map<number, number> = new Map();
    private readonly _territoryTypesMap: Map<number, number[]> = new Map();

    constructor( 
        private readonly parser: XMLParser, opts: IMafTransformOptions 
    ){
        super( opts );
        this._ageCategories = opts.agesCategories;
        this._catalogs = opts.catalogs;
        this._providers = opts.providers;
        this._mafTypes = opts.mafTypes;
        this._territoryTypes = opts.territoryTypes;
    }
    get MafData(){ return this.mafDataToSave; }
    get AgeCategoriesMap(){ return this._ageCategoriesMap; }
    get CatalogsMap(){ return this._catalogsMap; }
    get ProvidersMap(){ return this._providersMap; }
    get MafTypesMap(){ return this._mafTypesMap; }
    get TerritoryTypesMap(){ return this._territoryTypesMap; }

    async _transform( chunk: any, encoding: BufferEncoding, callback: TransformCallback ): Promise<void> {
        const content = await chunk.buffer();
        const jsonObj = this.parser.parse( content ) as IMafRaw;
        const maf = toMafDbData( jsonObj );

        const ageIdArr = checkAges( this._ageCategories, jsonObj.Catalog.ageCategory );
        if( ageIdArr.length > 0 ) this._ageCategoriesMap.set( maf.id, ageIdArr );

        const catalog = checkTitle( this._catalogs, jsonObj.Catalog.catalogName );
        const provider = checkTitle( this._providers, jsonObj.Catalog.provider );
        const mafType = checkTitle( this._mafTypes, jsonObj.Catalog.type );
        const territoryTypes = checkTitleArr( this._territoryTypes, jsonObj.Catalog.territoryType?.territoryType );

        if( catalog ) this._catalogsMap.set( maf.id, catalog.id );
        if( provider ) this._providersMap.set( maf.id, provider.id );
        if( mafType ) this._mafTypesMap.set( maf.id, mafType.id );
        if( territoryTypes.length > 0 ) this._territoryTypesMap.set( maf.id, territoryTypes.map( tt => tt.id ))

        if( maf ) {
            const length = this.mafDataToSave.push( maf );
            if( length >= 1000 ){
                try{
                    const compareArr: { id: number, vendor_code: string }[] = await mafBulkSave( this.mafDataToSave );
                    await Promise.all([
                        updateManyRelation( compareArr, this._ageCategoriesMap, 'mafs_age_categories_links', 'maf_id', 'age_category_id', 'age_category_order' ),
                        updateManyRelation( compareArr, this._territoryTypesMap, 'mafs_territory_types_links', 'maf_id', 'territory_type_id', 'territory_type_order' ),
                        updateOneRelation( compareArr, this._catalogsMap, 'mafs_catalog_links', 'maf_id', 'catalog_id' ),
                        updateOneRelation( compareArr, this._providersMap, 'mafs_provider_links', 'maf_id', 'provider_id' ),
                        updateOneRelation( compareArr, this._mafTypesMap, 'mafs_maf_type_links', 'maf_id', 'maf_type_id' ),
                    ])
                }catch(e){
                    callback(e);
                }finally{
                    this.mafDataToSave = [];
                    this._ageCategoriesMap.clear();
                    this._territoryTypesMap.clear();
                    this._catalogsMap.clear();
                    this._providersMap.clear();
                    this._mafTypesMap.clear();
                }
            }
        }
        callback();
    }
}

function toMafData( data: IMafRaw ): IMaf | null {
    if( !('Catalog' in data )) return null;
    const maf: IMaf = {
        Image: data.Catalog?.image ?? null,
        VendorCode: typeof data.Catalog?.vendorCode === 'number' ? data.Catalog?.vendorCode.toString() : '',
        AnalogSample: data.Catalog?.analogSample ?? '',
        SampleCode: data.Catalog?.sampleCode ?? '',
        Dimensions: data.Catalog?.dimensions ?? '',
        Description: data.Catalog?.description ?? '',
        Price: typeof data.Catalog?.price === 'number' ? data.Catalog?.price : 0,
        Name: data.Catalog?.name ?? '',
        Units: data.Catalog?.units ?? '',
        TypeEquipment: data.Catalog?.typeEquipment ?? '',
        SafetyZones: data.Catalog?.safetyZones ?? '',
        TechDocumentation: data.Catalog?.techDocumentation ?? '',
    };
    return maf;
}

function toMafDbData( data: IMafRaw ): IMafDb | null {
    if( !('Catalog' in data )) return null;
    const maf: IMafDb = {
        id: typeof data.Catalog?.vendorCode === 'number' ? data.Catalog?.vendorCode : parseInt( data.Catalog?.vendorCode ),
        image: data.Catalog?.image ?? '',
        vendor_code: typeof data.Catalog?.vendorCode === 'number' ? data.Catalog?.vendorCode.toString() : '',
        analog_sample: data.Catalog?.analogSample ?? '',
        sample_code: data.Catalog?.sampleCode ?? '',
        dimensions: data.Catalog?.dimensions ?? '',
        description: data.Catalog?.description ?? '',
        price: typeof data.Catalog?.price === 'number' ? data.Catalog?.price : 0,
        name: data.Catalog?.name ?? '',
        units: data.Catalog?.units ?? '',
        type_equipment: data.Catalog?.typeEquipment ?? '',
        safety_zones: data.Catalog?.safetyZones ?? '',
        tech_documentation: data.Catalog?.techDocumentation ?? '',
        // catalog_name: '',
        // provider: '',
        // age_category: ''
    };
    return maf;
}

async function mafBulkSave( data: IMafDb[] ){
    // await strapi.db.query("api::maf.maf").createMany({ data });
    return await strapi.db.connection( 'mafs' )
        .insert( data )
        .onConflict([ 'id' ])
        .merge()
        .whereRaw( 'mafs.id != excluded.id' )
        .andWhereRaw( 'mafs.vendor_code != excluded.vendor_code' )
        .returning(['id', 'vendor_code']);
}

async function updateAges( compareArr: { id: number, vendor_code: string }[], ageMap: Map<number,number[]> ){
    const data = [];
    compareArr.forEach( c => {
        if( ageMap.has( c.id ) ){
            const ageIdArr = ageMap.get( c.id );
            ageIdArr.forEach( ageId => {
                data.push({
                    maf_id: c.id,
                    age_category_id: ageId,
                    age_category_order: 1.0
                })
            })
        }
    })
    await strapi.db.connection( 'mafs_age_categories_links' )
        .insert( data )
        .whereRaw( 'mafs_age_categories_links.maf_id != excluded.maf_id' )
        .andWhereRaw( 'mafs_age_categories_links.age_category_id != excluded.age_category_id' )
}

async function updateOneRelation( compareArr: { id: number }[], map: Map<number,number>, collection: string, key1: string, key2: string ){
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

async function updateManyRelation( compareArr: { id: number }[], map: Map<number,number[]>, collection: string, key1: string, key2: string, key3: string ){
    const data = [];
    compareArr.forEach( c => {
        if( map.has( c.id ) ){
            const otherIdArr = map.get( c.id );
            otherIdArr.forEach( otherId => {
                data.push({
                    [key1]: c.id,
                    [key2]: otherId,
                    [key3]: 1.0,
                })
            })
        }
    })

    await strapi.db.connection( collection )
        .insert( data )
        .whereRaw( `${collection}.${key1} != excluded.${key1}` )
        .andWhereRaw( `${collection}.${key2} != excluded.${key2}` )
}

function getAges( ageStr: string ): { min: number, max: number } | null { // 'от 3 до 20'
    const match = ageStr.match(/\d+/g);
    if( match && match.length === 2 ){
        const [ min, max ] = match.map( Number );
        return { min, max };
    }else{
        return null;
    }
}

function checkAges( agesArr: IEntity<IAgeCategory>[], ageStr: string ){
    const target = getAges( ageStr );
    if( !target ) return [];
    const agesIdArr = [];
    for( let i = 0; i < agesArr.length; i++ ){
        const age = agesArr[ i ];
        if( target.min > age.Min && target.min < age.Max ){
            agesIdArr.push( age.id );
        }else if( age.Min > target.min && age.Max < target.max ){
            agesIdArr.push( age.id );
        }else if( target.max > age.Min && target.max < age.Max ){
            agesIdArr.push( age.id );
            break;
        }
    }
    return agesIdArr;
}

function checkTitle<T extends IEntity<ITitle>>( arr: T[], title?: string ): T | null {
    const entity = arr.find( a => a.Title === title );
    return entity ? entity : null;
}

function checkTitleArr<T extends IEntity<ITitle>>( arr: T[], titleArr?: string[] ): T[] {
    if( !titleArr || !Array.isArray( titleArr ) || titleArr.length === 0 ) return [];
    const entityArr: T[] = [];
    for( let i = 0; i < arr.length; i++ ){
        if( titleArr.includes( arr[i].Title ) ){
            entityArr.push( arr[i] );
        }
    }
    return entityArr;
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



