import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum BALANCE_HOLDER_KEY {
    POST_BALANCE_HOLDER_XLSX = 'POST_BALANCE_HOLDER_XLSX',
}

export interface BALANCE_HOLDER_API {
    [BALANCE_HOLDER_KEY.POST_BALANCE_HOLDER_XLSX]: IAPIPOST<[File]>
}

export const BALANCE_HOLDER_API: BALANCE_HOLDER_API = {
    POST_BALANCE_HOLDER_XLSX: {
        url: "/backend/api/balance-holder/upload",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    }
}