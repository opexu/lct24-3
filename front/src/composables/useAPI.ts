import axios, { AxiosError, isAxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { API_KEY, IAPI } from '@/types/api';
import { COOKIE_KEY, useCookiesStore } from '@/stores/cookie-store';
import type { AUTH_API } from '@/api/auth';

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

    async function strapipost<K, T extends IAPI<any>>( api: T, data: {} ): Promise<AxiosResponse<K, any>> {
        
        console.log('data: ', data)
        const config: AxiosRequestConfig = {
            url: api.url,
            method: 'post',
            data: data
        };
        if( cookies.isKey( COOKIE_KEY.JWT ) ) config.headers = { Authorization: `Bearer ${cookies.get(COOKIE_KEY.JWT)}` };
        
        const res = await axios<K>( config );
        console.log('post res: ', res)
        return res;
    }

    return { strapiget, strapipost }
}