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

const PlaygroundStore = usePlaygroundStore();
const { selectedPlayground } = storeToRefs( PlaygroundStore );


defineProps<{
    isLocked: boolean;
}>();

const selectPlaygroundVisible = ref(false);
const playgroundFilterVisible = ref(false);

async function downloadXML(){
    console.log('download xml')
}
</script>