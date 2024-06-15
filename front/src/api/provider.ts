import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum PROVIDER_KEY {
    GET_ALL = 'GET_ALL',
}

export interface PROVIDER_API {
    [PROVIDER_KEY.GET_ALL]: IAPI<any>
}

export const PROVIDER_API: PROVIDER_API = {
    GET_ALL: {
        url: "/backend/api/providers",
        handler: function(){
            return '';
        }
    }
}