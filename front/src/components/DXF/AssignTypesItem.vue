<template>
<div class="w-full h-fit p-1 flex flex-row items-center space-x-4">
    <!-- <Checkbox v-model="checked" :binary="true" /> -->
    <span class="relative whitespace-nowrap">{{ title }}</span>
    <MultiSelect class="w-fit md:w-20rem"
    v-model="selectedTypes"
    :options="types" 
    optionLabel="name" 
    placeholder="Выбрать типы"
    :showToggleAll="false"
    :maxSelectedLabels="0" 
    selectedItemsLabel="{0} выбрано"
    />
</div>
</template>

<script setup lang="ts">
import type { ICSDXFObject } from '@/scripts/CSLib';
import Checkbox from 'primevue/checkbox';
import MultiSelect from 'primevue/multiselect';
import { ref } from 'vue';
defineProps<{
    csdxf: ICSDXFObject;
    title: string;
    // checked: boolean;
}>();

// const checked = ref(true);
const selectedTypes = ref<{ name: string }[]>([])
const types = [
    { name: 'ТОЧКА' },
    { name: 'РЕГИОН' },
    { name: 'ЛИНИЯ' },
];
</script>