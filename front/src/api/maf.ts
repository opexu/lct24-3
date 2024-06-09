import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum MAF_KEY {
    POST_MAF_ZIP = 'POST_MAF_ZIP',
    POST_MAF_RELATIONS_ZIP = 'POST_MAF_RELATIONS_ZIP'
}

export interface MAF_API {
    [MAF_KEY.POST_MAF_ZIP]: IAPIPOST<[File]>,
    [MAF_KEY.POST_MAF_RELATIONS_ZIP]: IAPIPOST<[File]>
}

export const MAF_API: MAF_API = {
    
    POST_MAF_ZIP: {
        url: "/backend/api/maf/upload",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    },

    POST_MAF_RELATIONS_ZIP: {
        url: "/backend/api/maf/upload-relations",
        handler: function( file: File ){
            const formData = new FormData();
            formData.set(`files.File`, file, file.name);
            formData.append('data', JSON.stringify({ fileName: file.name }));
            return formData;
        }
    },

}