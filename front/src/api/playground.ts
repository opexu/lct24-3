import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum PLAYGROUND_KEY {
    POST_PLAYGROUND_XLSX = 'POST_PLAYGROUND_XLSX',
}

export interface PLAYGROUND_API {
    [PLAYGROUND_KEY.POST_PLAYGROUND_XLSX]: IAPIPOST<[File]>
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
    }
}