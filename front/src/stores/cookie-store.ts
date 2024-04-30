import { defineStore } from 'pinia';
import { computed, inject } from 'vue';
import type { VueCookies } from 'vue-cookies'

const PREFIX = "lct24-3";

export enum COOKIE_KEY {
    USER = PREFIX + "user",
    JWT = PREFIX + "jwt",
}

export const useCookiesStore = defineStore( 'useCookiesStore', () => {

    const $cookies = inject<VueCookies>('$cookies')!;
    
    function set( key: COOKIE_KEY, value: {} | string ){
        $cookies.set( key, value );
    }

    function get<T extends {} | undefined>( key: COOKIE_KEY ): T {
        return $cookies.get( key );
    }

    function remove( key: COOKIE_KEY ){
        return $cookies.remove( key );
    }

    function isKey( key: COOKIE_KEY ){
        return $cookies.isKey( key );
    }

    return {
        set, get, remove, isKey, 
    }
})