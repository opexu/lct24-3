import qs from 'qs';
import type { IAPI, IAPIPOST } from "@/types/api"

export enum PROJECT_KEY {
    POST_PROJECT = 'POST_PROJECT',
}

export interface PROJECT_API {
    [PROJECT_KEY.POST_PROJECT]: IAPIPOST<[File,string]>
}

export const PROJECT_API: PROJECT_API = {
    POST_PROJECT: {
        url: "/backend/api/projects",
        handler: function( file: File, Title: string ){
            const formData = new FormData();
            formData.append(`files.DXFS`, file, file.name);
            const data = { Title };
            formData.append('data', JSON.stringify( data ));
            return formData;
        }
    }
}