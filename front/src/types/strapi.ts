export interface IStrapiItem<T> {
    id: number,
    attributes: T
}

export interface IAxiosStrapi<T,K = {}>{
    data: T,
    meta?: K,
}

export interface ICU {
    createdAt: string;
    updatedAt: string;
}