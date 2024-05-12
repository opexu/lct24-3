<template>
<div class="w-full h-full text-white rounded-lg flex flex-col space-y-2">
    
    <Panel toggleable>
        <template #header>
            <span>Конструктор</span>
        </template>
        <template #default>
            <div class="w-full h-fit space-y-2">
                <DXFUploader class="w-full h-full relative" :is-locked="false"/>
                <DXFLayers v-if="DXFStore.HasDxf"/>
            </div>
        </template>
        
    </Panel>
    
    <Panel toggleable>
        <template #header>
            <span>Свойства</span>
        </template>
        <CSPropsView
        v-if="SelectedDXFCSArr.length > 0"
        />
        <Button outlined
        @click="loadMat" 
        >Мат</Button>
        <Button outlined
        @click="loadGeo" 
        >Гео</Button>
    </Panel>
</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import DXFUploader from './DXF/DXFUploader.vue';
import DXFLayers from './DXF/DXFLayers.vue';
import { useDXFStore } from '@/stores/dxf-store';
import CSPropsView from './Props/CSPropsView.vue';
import { useCSStore } from '@/stores/cs-store';
import { storeToRefs } from 'pinia';
import { useApi } from '@/composables/useAPI';
import { TEST_API, TEST_KEY } from '@/api/test';
import type { ISAFMaterialWithColors } from '@/scripts/SAF/ISAFMaterial';
const DXFStore = useDXFStore();
const CSStore = useCSStore();
const { SelectedDXFCSArr } = storeToRefs( CSStore );

async function loadMat(){
    type M = TEST_API[TEST_KEY.GET_MAT];
    const res = await useApi().strapiget<ISAFMaterialWithColors[], M>( TEST_API[TEST_KEY.GET_MAT], 1 )
    const materials = res.data.data;
    if( materials ){
        console.log('materials[0].attributes.Title: ', materials[0].attributes.Title);
        console.log('materials[0].attributes.colors.data[0].HEX: ', materials[0].attributes.colors.data[0].attributes.HEX);
    }
}
async function loadGeo(){
    type G = TEST_API[TEST_KEY.GET_GEO];
    const res = await useApi().strapiget<any[], G>( TEST_API[TEST_KEY.GET_GEO], 1 )
    const geos = res.data.data;
    if( geos ){
        
    }
}
</script>