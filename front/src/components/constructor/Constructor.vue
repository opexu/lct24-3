<template>
<div class="card flex justify-content-center">
    <div class="w-full h-full flex flex-col gap-2">
        <Button outlined class="w-full"
        @click="selectPlaygroundVisible = true"
        v-tooltip.bottom = "'Открыть конструктор наполнения площадок'"
        >Создать площадку</Button>

        <div class="flex flex-row gap-2">
            <Button outlined class="w-full"
            @click="playgroundFilterVisible = true"
            :disabled="!selectedPlayground"
            v-tooltip.bottom = "'Открыть редактор наполнений'"
            >Редактировать наполнение</Button>
            <Button icon="pi pi-download" outlined
            @click="downloadXML"
            :disabled="!selectedPlayground"
            v-tooltip.bottom = "'Скачать XML'"
            />
        </div>
        
    </div>

    <SelectPlayground
    v-model:select-playground-visible="selectPlaygroundVisible"
    />
    <PlaygoundFilter
    v-model:playground-filter-visible="playgroundFilterVisible"
    />
</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { ref } from 'vue';
import { usePlaygroundStore } from '@/stores/playground-store';
import { storeToRefs } from 'pinia';
import SelectPlayground from '@/components/constructor/SelectPlayground.vue';
import PlaygoundFilter from '@/components/constructor/PlaygroundFilter.vue';
import { useCSStore } from '@/stores/cs-store';
import { XMLBuilder, type XmlBuilderOptions } from 'fast-xml-parser';
import { downloadXmlFile, getFormattedDate } from '@/scripts/utils/Utils';

const PlaygroundStore = usePlaygroundStore();
const { selectedPlayground } = storeToRefs( PlaygroundStore );
const CSStore = useCSStore();

defineProps<{
    isLocked: boolean;
}>();

const selectPlaygroundVisible = ref(false);
const playgroundFilterVisible = ref(false);

async function downloadXML(){
    if( !selectedPlayground.value ){
        console.warn('Площадка не выбрана');
        return;
    }
    console.log('download xml')
    const sceneGraph = CSStore.CS?.buildSceneGraph();
    if( !sceneGraph ) return;
    
    const options: XmlBuilderOptions  = {
        ignoreAttributes : false
    };

    const builder = new XMLBuilder( options );
    let xmlDataStr = builder.build( sceneGraph );

    const fileName = selectedPlayground.value.id.toString() + '-' + getFormattedDate() + '.xml';
    downloadXmlFile( xmlDataStr, fileName );
}
</script>