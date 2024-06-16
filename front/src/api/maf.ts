import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum MAF_KEY {
    POST_MAF_ZIP = 'POST_MAF_ZIP',
    POST_MAF_RELATIONS_ZIP = 'POST_MAF_RELATIONS_ZIP',
    FILTER_MAFS = 'FILTER_MAFS',
    POINTS = 'POINTS',
}

export interface MAF_API {
    [MAF_KEY.POST_MAF_ZIP]: IAPIPOST<[File]>,
    [MAF_KEY.POST_MAF_RELATIONS_ZIP]: IAPIPOST<[File]>,
    [MAF_KEY.FILTER_MAFS]: IAPI<[number[], number[], number[], number[], number[], number, number, { min?: number, max?: number }]>,
    [MAF_KEY.POINTS]: IAPI<[number[]]>,
}

export const MAF_API: MAF_API = {
    
    POST_MAF_ZIP: {
        url: "/backend/api/maf/upload",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    },

    POST_MAF_RELATIONS_ZIP: {
        url: "/backend/api/maf/upload-relations",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    },

    FILTER_MAFS: {
        url: "/backend/api/mafs",
        handler: function ( mafTypesIdArr: number[], catalogsIdArr: number[], providersIdArr: number[], territoryTypesIdArr: number[], ageCategoriesIdArr: number[], page: number, pageSize: number, price: { min?: number, max?: number } = {} ){
            return qs.stringify({
                filters: {
                    $and: (() => {
                        const andArr = [];
                        if( mafTypesIdArr.length > 0 ) andArr.push({ maf_type: { id: { $in: mafTypesIdArr }}});
                        if( catalogsIdArr.length > 0 ) andArr.push({ catalog: { id: { $in: catalogsIdArr }}});
                        if( providersIdArr.length > 0 ) andArr.push({ provider: { id: { $in: providersIdArr }}});
                        if( territoryTypesIdArr.length > 0 ) andArr.push({ territory_types: { id: { $in: territoryTypesIdArr }}});
                        if( ageCategoriesIdArr.length > 0 ) andArr.push({ age_categories: { id: { $in: ageCategoriesIdArr }}});
                        if( price.min && price.max ) andArr.push({ Price: { $between: [ price.min, price.max ] }});
                        else if ( price.min ) andArr.push({ Price: { $gte: price.min }});
                        else if ( price.max ) andArr.push({ Price: { $lte: price.max }});
                        return andArr;
                    })()
                },
                populate: [
                    'maf_type',
                    'catalog',
                    'provider',
                    'territory_types',
                    'age_categories',
                ],
                pagination: {
                    page: page,
                    pageSize: pageSize,
                    withCount: true,
                }
            }, { encodeValuesOnly: true });
        }
    },

    POINTS: {
        url: "/backend/api/maf/points",
        handler: function( mafsIdArr: number[] ){
            return qs.stringify({
                mafsIdArr: mafsIdArr
            }, { encodeValuesOnly: true });
        }
    }

}