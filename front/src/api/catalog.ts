import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum CATALOG_KEY {
    GET_ALL = 'GET_ALL',
}

export interface CATALOG_API {
    [CATALOG_KEY.GET_ALL]: IAPI<any>
}

export const CATALOG_API: CATALOG_API = {
    GET_ALL: {
        url: "/backend/api/catalogs",
        handler: function(){
            return '';
        }
    }
}