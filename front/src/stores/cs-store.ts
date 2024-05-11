import { CSCore, CSEvent, type ICSCore } from "@/scripts/CSLib";
import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";

export const useCSStore = defineStore( 'useCSStore', () => {

    const _CS = shallowRef<ICSCore | null>();
    const CS = computed(() => _CS.value );

    function init( div: HTMLDivElement ){
        _CS.value = new CSCore( div );
        _CS.value.on( CSEvent.DXF_OBJ_SELECT, ( obj ) => {
            console.log('select')
        })
    }

    function resize( width: number, height: number ){
        _CS.value?.resize( width, height );
    }

    function dispose(){
        if( !_CS.value ) return;
    }

    return { CS, init, resize, dispose }
})