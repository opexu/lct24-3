export interface IStrapi<T>{
    id: number;
    attributes: T;
}

export interface IAxios<T,K = {}>{
    data?: T,
    meta?: K,
}

export type IManyRelation<K, T> = {
    [K:string]: K extends string ? { data: T } : never;
}

export type IOneRelation<K, T> = {
    [K:string]: K extends string ? T : never;
}

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