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
        <p class="m-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, quibusdam. Reiciendis eveniet est maiores adipisci, quis et? Maxime quia velit obcaecati totam aut dolor voluptatum rem asperiores, deserunt maiores delectus.</p>
    </Panel>
</div>
</template>

<script setup lang="ts">
import Panel from 'primevue/panel';
import DXFUploader from './DXF/DXFUploader.vue';
import DXFLayers from './DXF/DXFLayers.vue';
import { useDXFStore } from '@/stores/dxf-store';
const DXFStore = useDXFStore();
</script>