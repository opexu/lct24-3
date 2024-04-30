import axios, { AxiosError } from "axios";
import type { IAuthError, IAuthResult, IAuthSuccess, IStrapiAuth } from "@/types/auth";
import { useApi } from "@/composables/useAPI";
import { COOKIE_KEY, useCookiesStore } from "@/stores/cookie-store";
import { AUTH_API } from "@/api/auth";
import type { API_KEY } from "@/types/api";
import type { IAxiosStrapi } from "@/types/strapi";
import type { NavigationGuardNext } from "vue-router";

export async function isAuthenticated(): Promise<IAuthResult> {

    const { strapiget } = useApi();
    const cookies = useCookiesStore();

    if( cookies.isKey( COOKIE_KEY.JWT ) ){
        try{
            const res = await strapiget<IStrapiAuth, AUTH_API[API_KEY.ME]>( AUTH_API.me );
            return {
                isAuth: true,
                id: res.data.id,
                username: res.data.username,
                email: res.data.email,
            } satisfies IAuthSuccess;
        }catch(e){
            const err = e as Error | AxiosError;
            if( axios.isAxiosError( err ) ){
                console.log('An error occurred:', err.response);
                return {
                    isAuth: false,
                } satisfies IAuthError
            }else{
                console.warn('err is not type of AxiosError: ', e)
                return {
                    isAuth: false,
                } satisfies IAuthError
            }
        }
        
    }else{
        console.log('JWT token is empty');
        return {
            isAuth: false,
        } satisfies IAuthError;
    }
}

export async function strapiauth( next: NavigationGuardNext, opts?: { okname?: string, errorname?: string }){
    const authResult = await isAuthenticated();
    if( isAuthSuccess( authResult ) ){
        const { isAuth } = authResult;
        if( isAuth ){
            opts?.okname ? next({ name: opts.okname }) : next();
        }else{
            opts?.errorname ? next({ name: opts.errorname }) : next();
        }
    }else{
        opts?.errorname ? next({ name: opts.errorname }) : next();
    }
}

export function isAuthSuccess(authData: IAuthResult ): authData is IAuthSuccess {
    return authData.isAuth;
}