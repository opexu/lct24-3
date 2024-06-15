import { CSCore, CSEvent, type ICSCore, type ICSMafObject, type ICSObject } from "@/scripts/CSLib";
import { defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";

export const useCSStore = defineStore( 'useCSStore', () => {

    const _CS = shallowRef<ICSCore | null>();
    const CS = computed(() => _CS.value );

    const SelectedCSArr = ref<ICSObject[]>([]);

    function init( div: HTMLDivElement ){
        _CS.value = new CSCore( div );
        _CS.value.on( CSEvent.SELECT, ( obj ) => {
            SelectedCSArr.value.push( obj )
        });
        _CS.value.on( CSEvent.DESELECT, ( obj ) => {
            const index = SelectedCSArr.value.findIndex( csdxf => csdxf.ID === obj.ID );
            if( index === -1 ) return;
            SelectedCSArr.value.splice( index, 1 );
        });
        _CS.value.on( CSEvent.TRANSFORM_UPDATE, ( obj ) => {
            const index = SelectedCSArr.value.findIndex( csdxf => csdxf.ID === obj.ID );
            if( index === -1 ) return;
            SelectedCSArr.value.splice( index, 1, obj );
        })
    }

    function resize( width: number, height: number ){
        _CS.value?.resize( width, height );
    }

    function dispose(){
        if( !_CS.value ) return;
    }

    return { CS, SelectedCSArr, init, resize, dispose }
})