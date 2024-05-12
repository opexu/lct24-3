import { defineStore, storeToRefs } from "pinia";
import { useCSStore } from "./cs-store";
import type { IDxf } from "dxf-parser";
import { computed, reactive, ref } from "vue";
import * as DXFUtils from '../scripts/utils/DXFUtils';

export const useDXFStore = defineStore( 'useDXFStore', () => {

    const CSStore = useCSStore();
    const { CS } = storeToRefs( CSStore );

    const dxf = ref<IDxf | null>( null );

    function onDxfUploaded( _dxf: IDxf ){
        console.log('dxf uploaded', _dxf);
        dxf.value = _dxf;
        CS.value?.drawDxf( _dxf );
    }

    function clearDxf(){
        dxf.value = null;
        CS.value?.clearDxf();
    }

    const HasDxf = computed(() => dxf.value ? true : false );
    const DxfLayers = computed(() => dxf.value ? DXFUtils.getLayersWithCount( dxf.value ).filter( dl => dl.count > 0 ) : [])
    return {
        onDxfUploaded, clearDxf, 
        DxfLayers, HasDxf
    }
})