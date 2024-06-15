import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum TERRITORY_TYPE_KEY {
    GET_ALL = 'GET_ALL',
}

export interface TERRITORY_TYPE_API {
    [TERRITORY_TYPE_KEY.GET_ALL]: IAPI<any>
}

export const TERRITORY_TYPE_API: TERRITORY_TYPE_API = {
    GET_ALL: {
        url: "/backend/api/territory-types",
        handler: function(){
            return '';
        }
    }
}