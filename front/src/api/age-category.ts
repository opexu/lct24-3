import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum AGE_CATEGORY_KEY {
    GET_ALL = 'GET_ALL',
}

export interface AGE_CATEGORY_API {
    [AGE_CATEGORY_KEY.GET_ALL]: IAPI<any>
}

export const AGE_CATEGORY_API: AGE_CATEGORY_API = {
    GET_ALL: {
        url: "/backend/api/age-categories",
        handler: function(){
            return '';
        }
    }
}