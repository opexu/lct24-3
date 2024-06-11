<template>
<div class="w-full h-full text-white rounded-lg flex flex-col gap-2 overflow-hidden">
    
    <Panel toggleable>
        <template #header>
            <span>Загрузить файлы</span>
        </template>
        <template #default>
            <div class="w-full h-fit gap-2">
                <MAFUploader class="w-full h-full relative" :is-locked="false"/>
            </div>
        </template>
    </Panel>

    <Panel toggleable>
        <template #header>
            <span>Конструктор наполнений</span>
        </template>
        <template #default>
            <div class="w-full h-fit gap-2">
                <Constructor class="w-full h-full relative" :is-locked="false"/>
            </div>
        </template>
    </Panel>

    <Panel toggleable>
        <template #header>
            <span>Конструктор из файла</span>
        </template>
        <template #default>
            <div class="w-full h-fit gap-2">
                <DXFUploader class="w-full h-full relative" :is-locked="false"/>
                <DXFLayers v-if="DXFStore.HasDxf"/>
            </div>
        </template>
    </Panel>
    
    <Panel toggleable 
    v-if="selectedPlayground"
    >
        <template #header>
            <span>Информация</span>
        </template>
        <PlaygroundInfoView
        :playground="selectedPlayground"
        />
    </Panel>

    <Panel collapsed 
    class="h-full flex flex-col overflow-hidden"
    :pt="{ toggleablecontent: 'h-full overflow-hidden pb-4', content: 'h-full overflow-auto' }"
    :pt-options="{ mergeProps: true }"
    >
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
import CSPropsView from '@/components/Props/CSPropsView.vue';
import PlaygroundInfoView from '@/components/Info/PlaygroundInfoView.vue';
import { useCSStore } from '@/stores/cs-store';
import { storeToRefs } from 'pinia';
import { useApi } from '@/composables/useAPI';
import { TEST_API, TEST_KEY } from '@/api/test';
import type { ISAFMaterialWithColors } from '@/scripts/SAF/ISAFMaterial';
import type { IAxios } from '@/types/strapi';
import MAFUploader from './MAFUploader.vue';
import Constructor from '@/components/constructor/Constructor.vue';
import { usePlaygroundStore } from '@/stores/playground-store';

const DXFStore = useDXFStore();
const CSStore = useCSStore();
const { SelectedDXFCSArr } = storeToRefs( CSStore );
const PlaygroundStore = usePlaygroundStore();
const { selectedPlayground } = storeToRefs( PlaygroundStore );

async function loadMat(){
    type M = TEST_API[TEST_KEY.GET_MAT];
    const res = await useApi().strapiget<IAxios<ISAFMaterialWithColors[]>, M>( TEST_API[TEST_KEY.GET_MAT], 1 )
    const materials = res.data.data;
    if( materials ){
        console.log('materials[0].attributes.Title: ', materials[0].attributes.Title);
        console.log('materials[0].attributes.colors.data[0].HEX: ', materials[0].attributes.colors.data[0].attributes.HEX);
    }
}
async function loadGeo(){
    type G = TEST_API[TEST_KEY.GET_GEO];
    const res = await useApi().strapiget<IAxios<any[]>, G>( TEST_API[TEST_KEY.GET_GEO], 1 )
    const geos = res.data.data;
    if( geos ){
        console.log('geos: ', geos)
    }
}
</script>