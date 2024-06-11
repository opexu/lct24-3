import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum PLAYGROUND_KEY {
    POST_PLAYGROUND_XLSX = 'POST_PLAYGROUND_XLSX',
    POST_PLAYGROUND_COORDS_XLSX = 'POST_PLAYGROUND_COORDS_XLSX',
    POST_PLAYGROUND_MAFS_XLSX = 'POST_PLAYGROUND_MAFS_XLSX',
    POST_PLAYGROUND_LIMITS_XLSX = 'POST_PLAYGROUND_LIMITS_XLSX',
    GET_ALL = 'GET_ALL',
}

export interface PLAYGROUND_API {
    [PLAYGROUND_KEY.POST_PLAYGROUND_XLSX]: IAPIPOST<[File]>;
    [PLAYGROUND_KEY.POST_PLAYGROUND_COORDS_XLSX]: IAPIPOST<[File]>;
    [PLAYGROUND_KEY.POST_PLAYGROUND_MAFS_XLSX]: IAPIPOST<[File]>;
    [PLAYGROUND_KEY.POST_PLAYGROUND_LIMITS_XLSX]: IAPIPOST<[File]>;
    [PLAYGROUND_KEY.GET_ALL]: IAPI<any>;
}

export const PLAYGROUND_API: PLAYGROUND_API = {
    
    POST_PLAYGROUND_XLSX: {
        url: "/backend/api/playground/upload",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    },

    POST_PLAYGROUND_COORDS_XLSX: {
        url: "/backend/api/playground/upload-coords",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    },

    POST_PLAYGROUND_MAFS_XLSX: {
        url: "/backend/api/playground/upload-mafs",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    },

    POST_PLAYGROUND_LIMITS_XLSX: {
        url: "/backend/api/playground/upload-funding-limits",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    },

    GET_ALL: {
        url: "/backend/api/playgrounds",
        handler: function(){
            return qs.stringify({
                filters: {
                    // yard_area: { $notNull: true },
                    $and: [
                        { yard_area: { $notNull: true } },
                        { Coords: { $notNull: true } },
                    ]
                },
                populate: [
                    'yard_area',
                    'yard_area.district',
                    'yard_area.grbc',
                    'yard_area.region',
                    'yard_area.balance_holder',
                ]
            }, { encodeValuesOnly: true });
        }
    }
}