export interface IStrapi<T>{
    id: number;
    attributes: T;
}

export interface IAxios<T,K = {}>{
    data?: T,
    meta?: K,
}

export type IManyRelation<K extends string, T> = Record<K, { data: T }>;
export type IOneRelation<K extends string, T> = Record<K,T>;
// export type IOneRelation<K, T> = {
//     [K:string]: K extends string ? T : never;
// }

export interface IDated {
    createdAt: string;
    updatedAt: string;
}

export interface IUpload {
    ext: string;
    hash: string;
    mime: string;
    name: string;
    url: string;
    size: number;
}

export enum API {
    AGE_CATEGORY = 'api::age-category.age-category',
    MAF = 'api::maf.maf',
    BALANCE_HOLDER = 'api::balance-holder.balance-holder',
    REGION = 'api::region.region',
    GRBC = 'api::grbc.grbc',
    DISTRICT = 'api::district.district',
    YARD_AREA = 'api::yard-area.yard-area',
    CATALOG = 'api::catalog.catalog',
    PROVIDER = 'api::provider.provider',
    MAF_TYPE = 'api::maf-type.maf-type',
    TERRITORY_TYPE = 'api::territory-type.territory-type',
    PLAYGROUND = 'api::playground.playground',
}