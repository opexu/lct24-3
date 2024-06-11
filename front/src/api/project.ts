import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum PROJECT_KEY {
    POST_PROJECT_XLSX = 'POST_PROJECT_XLSX',
}

export interface PROJECT_API {
    [PROJECT_KEY.POST_PROJECT_XLSX]: IAPIPOST<[File]>
}

export const PROJECT_API: PROJECT_API = {
    POST_PROJECT_XLSX: {
        url: "/backend/api/project/upload",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    }
}