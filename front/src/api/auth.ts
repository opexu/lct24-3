import type { IAPI } from '@/types/api';
import qs from 'qs';

export enum API_KEY {
    AUTH = 'auth',
    ME = 'me',
}

export interface AUTH_API {
    [API_KEY.AUTH]: IAPI<[string, string]>;
    [API_KEY.ME]: IAPI<any>;
}

export const AUTH_API: AUTH_API = {

    auth: {
        url: "/backend/api/auth/local",
        handler: function( identifier: string, password: string ){
            const obj = { identifier, password };
            console.log('obj: ', obj)
            return obj;
        },
    },

    me: {
        url: "/backend/api/users/me",
        handler: function(){
            return qs.stringify({
                populate: {
                    role: true,
                }
            }, { encodeValuesOnly: true }); // prettify URL)
        }
    },
}