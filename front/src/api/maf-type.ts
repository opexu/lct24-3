import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum MAF_TYPE_KEY {
    GET_ALL = 'GET_ALL',
}

export interface MAF_TYPE_API {
    [MAF_TYPE_KEY.GET_ALL]: IAPI<any>
}

export const MAF_TYPE_API: MAF_TYPE_API = {
    GET_ALL: {
        url: "/backend/api/maf-types",
        handler: function(){
            return '';
        }
    }
}