import { CSCore, CSEvent, type ICSCore, type ICSDXFObject } from "@/scripts/CSLib";
import { defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";

export const useCSStore = defineStore( 'useCSStore', () => {

    const _CS = shallowRef<ICSCore | null>();
    const CS = computed(() => _CS.value );

    const SelectedDXFCSArr = ref<ICSDXFObject[]>([]);

    function init( div: HTMLDivElement ){
        _CS.value = new CSCore( div );
        _CS.value.on( CSEvent.DXF_OBJ_SELECT, ( obj ) => {
            SelectedDXFCSArr.value.push( obj )
        });
        _CS.value.on( CSEvent.DXF_OBJ_DESELECT, ( obj ) => {
            const index = SelectedDXFCSArr.value.findIndex( csdxf => csdxf.ID === obj.ID );
            if( index === -1 ) return;
            SelectedDXFCSArr.value.splice( index, 1 );
        });
        _CS.value.on( CSEvent.DXF_OBJ_TRANSFORM_UPDATE, ( obj ) => {
            const index = SelectedDXFCSArr.value.findIndex( csdxf => csdxf.ID === obj.ID );
            if( index === -1 ) return;
            SelectedDXFCSArr.value.splice( index, 1, obj );
        })
    }

    function resize( width: number, height: number ){
        _CS.value?.resize( width, height );
    }

    function dispose(){
        if( !_CS.value ) return;
    }

    return { CS, SelectedDXFCSArr, init, resize, dispose }
})