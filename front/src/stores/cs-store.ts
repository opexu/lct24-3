import { CSCore, type ICSCore } from "@/scripts/CSLib";
import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";

export const useCSStore = defineStore( 'useCSStore', () => {

    const _CS = shallowRef<ICSCore | null>();
    const CS = computed(() => _CS.value );

    function init( div: HTMLDivElement ){
        _CS.value = new CSCore( div );
    }

    function resize( width: number, height: number ){
        _CS.value?.resize( width, height );
    }

    return { CS, init, resize }
})