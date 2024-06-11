import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { IAPI, IAPIPOST } from '@/types/api';
import { COOKIE_KEY, useCookiesStore } from '@/stores/cookie-store';
import type { IAxios } from '@/types/strapi';

export function useApi(){
    
    const cookies = useCookiesStore();

    async function strapiget<K, T extends IAPI<any>>( api: T, ...params: Parameters<T['handler']> ): Promise<AxiosResponse<K, any>> {

        const query = api.handler( ...params );

        const config: AxiosRequestConfig = {
            url: query !== '' ? api.url + `?${api.handler( ...params )}` : api.url,
            method: 'get',
        };
        if( cookies.isKey( COOKIE_KEY.JWT ) ) config.headers = { Authorization: `Bearer ${cookies.get(COOKIE_KEY.JWT)}` };

        const res = await axios<K>( config );
        console.log('get res: ', res)
        return res;
    }

    async function strapipost<K, T extends IAPIPOST<any> | IAPI<any>>( api: T, ...params: Parameters<T['handler']> ): Promise<AxiosResponse<K, any>> {
        
        console.log('params: ', params)
        const config: AxiosRequestConfig = {
            url: api.url,
            method: 'post',
            data: api.handler( ...params ),
            // transformRequest: [
            //     ( data ) => data,
            // ]
        };
        if( cookies.isKey( COOKIE_KEY.JWT ) ) config.headers = { Authorization: `Bearer ${cookies.get(COOKIE_KEY.JWT)}` };
        
        const res = await axios<K>( config );
        console.log('post res: ', res)
        return res;
    }

    // async function strapipost<K, T extends IAPIPOST<any>>( api: T, ...params: Parameters<T['handler']> ): Promise<K> {
        
    //     const headers = new Headers();
    //     if( cookies.isKey( COOKIE_KEY.JWT ) ) headers.append( 'Authorization', `Bearer ${cookies.get(COOKIE_KEY.JWT)}` );

    //     const requestInit: RequestInit = {
    //         method: 'POST',
    //         headers: headers,
    //         body: api.handler( ...params ),
    //     }
        
    //     const res = await fetch( api.url, requestInit );
    //     if( res.ok ){
    //         return await res.json() as K;
    //     }else{
    //         const err = await res.json();
    //         throw err;
    //     }
    // }

    return { strapiget, strapipost }
}