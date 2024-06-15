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

    <Panel 
    class="h-full flex flex-col overflow-hidden"
    :pt="{ toggleablecontent: 'h-full overflow-hidden pb-4', content: 'h-full overflow-auto' }"
    :pt-options="{ mergeProps: true }"
    >
        <template #header>
            <span>Свойства</span>
        </template>
        <CSPropsView
        v-if="SelectedCSArr.length > 0"
        />
        
    </Panel>
</div>
</template>

<script setup lang="ts">
import Panel from 'primevue/panel';
import DXFUploader from './DXF/DXFUploader.vue';
import DXFLayers from './DXF/DXFLayers.vue';
import { useDXFStore } from '@/stores/dxf-store';
import CSPropsView from '@/components/Props/CSPropsView.vue';
import PlaygroundInfoView from '@/components/Info/PlaygroundInfoView.vue';
import { useCSStore } from '@/stores/cs-store';
import { storeToRefs } from 'pinia';
import MAFUploader from './MAFUploader.vue';
import Constructor from '@/components/constructor/Constructor.vue';
import { usePlaygroundStore } from '@/stores/playground-store';
import { watch } from 'vue';

const DXFStore = useDXFStore();
const CSStore = useCSStore();
const { SelectedCSArr } = storeToRefs( CSStore );
const PlaygroundStore = usePlaygroundStore();
const { selectedPlayground } = storeToRefs( PlaygroundStore );
</script>