<template>
<div class="card flex justify-content-center">
    <Button icon="pi pi-check"
    :disabled="SelectedDXFCSArr.length === 0"
    @click="visible = true"
    v-tooltip.bottom = "'Назначить типы'"
    />
    <Dialog class="text-primary w-fit max-w-2/3 overflow-hidden"
    :pt="{ content: 'relative h-fit overflow-y-auto' }"
    :pt-options="{ mergeProps: true }"
    modal header="Назначить типы на объекты"
    v-model:visible="visible">
        <template #header>
            <div class="text-primary dark:text-surface-300 w-fit flex flex-col space-y-4 mb-5">
                <span class="text-lg text-primary">Назначить типы на объекты</span>
                <p class="whitespace-break">Присвоить каждому выделенному объекту <br>один из встроенных типов</p>
            </div>
        </template>
        <div class="relative w-full max-h-full flex flex-col overflow-hiden">
            <div class="w-full max-h-full flex overflow-y-auto">
                <div class="w-full h-fit flex flex-col space-y-2">
                    <AssignTypesItem v-for="( csdxf ) in SelectedDXFCSArr" :key="csdxf.ID"
                    :csdxf="csdxf"
                    :title="csdxf.ID + ' - ' + csdxf.DXFLayer + ' - ' + csdxf.Type"
                    />
                </div>
            </div>
        </div>        
    </Dialog>
</div>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { ref } from "vue";
import { useCSStore } from '@/stores/cs-store';
import { storeToRefs } from 'pinia';
import AssignTypesItem from './AssignTypesItem.vue';

const CSStore = useCSStore();
const { SelectedDXFCSArr } = storeToRefs( CSStore );
const visible = ref(false);


</script>