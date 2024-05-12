import qs from 'qs';
import type { IAPI } from "@/types/api"

export enum TEST_KEY {
    GET_MAT = 'GET_MAT',
    GET_GEO = 'GET_GEO',
}

export interface TEST_API {
    [TEST_KEY.GET_MAT]: IAPI<[number]>,
    [TEST_KEY.GET_GEO]: IAPI<[number]>,
}

export const TEST_API: TEST_API = {

    GET_MAT: {
        url: "/backend/api/materials",
        handler: function ( id: number ): string {
            return qs.stringify({
                filters: {
                    id: id
                },
                populate: {
                    colors: true,
                }
            }, { encodeValuesOnly: true });
        }
    },

    GET_GEO: {
        url: "/backend/api/models",
        handler: function ( id: number ): string {
            return qs.stringify({
                filters: {
                    id: id
                },
                populate: {
                    geometry: true,
                    texture: true
                }
            }, { encodeValuesOnly: true });
        }
    },
}