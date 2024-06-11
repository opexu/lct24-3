<template>
<div class="card flex justify-content-center">
    <div class="w-full h-full flex flex-col gap-2">
        <Button outlined class="w-full"
        @click="visible = true"
        v-tooltip.bottom = "'Открыть конструктор наполнения площадок'"
        >Создать площадку</Button>

        <Button outlined class="w-full"
        @click="visible = true"
        :disabled="!selectedPlayground"
        v-tooltip.bottom = "'Открыть редактор наполнений'"
        >Создать наполнение</Button>
    </div>

    <SelectPlayground
    v-model:visible="visible"
    />
</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { ref } from 'vue';
import { usePlaygroundStore } from '@/stores/playground-store';
import { storeToRefs } from 'pinia';
import SelectPlayground from '@/components/constructor/SelectPlayground.vue';

const PlaygroundStore = usePlaygroundStore();
const { selectedPlayground } = storeToRefs( PlaygroundStore );


defineProps<{
    isLocked: boolean;
}>();

const visible = ref(false);
</script>