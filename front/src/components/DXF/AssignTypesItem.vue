<template>
<div class="w-full h-fit p-1 flex flex-row items-center space-x-4">
    <!-- <Checkbox v-model="checked" :binary="true" /> -->
    <span class="relative whitespace-nowrap">{{ title }}</span>
    <Dropdown class="w-fit md:w-20rem"
    v-model="selectedEngineType"
    :options="csdxf.AvailableEngineTypes" 
    placeholder="Выбрать типы"
    @change="onTypeChange"
    />
</div>
</template>

<script setup lang="ts">
import type { CSEngineType, ICSDXFObject } from '@/scripts/CSLib';
import Dropdown, { type DropdownChangeEvent } from 'primevue/dropdown';
import { onMounted, onUnmounted, ref } from 'vue';
const props = defineProps<{
    csdxf: ICSDXFObject;
    title: string;
    // checked: boolean;
}>();

const selectedEngineType = ref( props.csdxf.EngineType );

function onTypeChange( event: DropdownChangeEvent ){
    console.log('type change: ', event.value)
    props.csdxf.assignEngineType( event.value );
    selectedEngineType.value = props.csdxf.EngineType;
}
</script>