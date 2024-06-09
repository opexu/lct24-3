import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum YARD_AREA_KEY {
    POST_YARD_AREA_XLSX = 'POST_YARD_AREA_XLSX',
}

export interface YARD_AREA_API {
    [YARD_AREA_KEY.POST_YARD_AREA_XLSX]: IAPIPOST<[File]>
}

export const YARD_AREA_API: YARD_AREA_API = {
    POST_YARD_AREA_XLSX: {
        url: "/backend/api/yard-area/upload",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    }
}