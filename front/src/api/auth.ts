import type { IAPI, API_KEY } from '@/types/api';
import qs from 'qs';

export interface AUTH_API {
    [API_KEY.AUTH]: IAPI<any>;
    [API_KEY.ME]: IAPI<any>;
}

export const AUTH_API: AUTH_API = {

    auth: {
        url: "/backend/api/auth/local",
        handler: () => '',
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