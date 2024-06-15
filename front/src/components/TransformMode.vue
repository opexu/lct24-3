<template>
<div class="w-full h-fit flex flex-col space-y-2">
    <Button class="w-full"
    severity="secondary"
    v-for="( mode ) in coreModes" :key="mode.mode"
    :icon="mode.icon"
    :outlined="activeCoreMode.mode !== mode.mode"
    v-tooltip.left="mode.tooltip"
    @click="activeCoreMode = mode"
    />
    <div class="w-full h-fit flex flex-col space-y-2"
    v-if="activeCoreMode.mode === CSMode.EDIT && CSStore.SelectedCSArr.length === 1"
    >
        <Button class="w-full" 
        v-for="( mode ) in filterModes()" :key="mode.mode"
        :icon="mode.icon"
        :outlined="activeTransformMode.mode !== mode.mode"
        v-tooltip.left="mode.tooltip"
        @click="activeTransformMode = mode"
        />
    </div>
</div>
</template>

<script setup lang="ts">
import { CSMode } from '@/scripts/CSLib';
import { useCSStore } from '@/stores/cs-store';
import Button from 'primevue/button';
import { computed, ref, watch } from 'vue';

const CSStore = useCSStore();

interface CSCoreMode { mode: number, icon: string, tooltip: string };
const coreModes = ref<CSCoreMode[]>([ 
    { mode: CSMode.SELECT, icon: "pi pi-arrow-up-left", tooltip: "Режим выделения. Кликать мышкой по зоне безопасности" }, 
    { mode: CSMode.EDIT, icon: "pi pi-pencil", tooltip: "Режим редактирования" }, 
]);
const activeCoreMode = ref<CSCoreMode>( coreModes.value[0] );
watch( activeCoreMode, ( value, oldValue ) => {
    if( !value || value.mode === oldValue.mode ) return;
    CSStore.CS?.setMode( activeCoreMode.value.mode );
});

interface TransformMode { mode: 'translate' | 'rotate', icon: string, tooltip: string };
const transformModes = ref<TransformMode[]>([ 
    { mode: "translate", icon: "pi pi-arrows-alt", tooltip: "Двигать. Допускается двигать если выделен только один объект" }, 
    { mode: "rotate", icon: "pi pi-sync", tooltip: "Вращать. Допускается вращать если выделен только один объект" }, 
]);
function filterModes(){
    if( CSStore.SelectedCSArr[0].CanRotate ){
        return transformModes.value;
    }else{
        activeTransformMode.value = transformModes.value[0];
        return transformModes.value.filter( m => m.mode !== 'rotate' );
    }
};
const activeTransformMode = ref<TransformMode>( transformModes.value[0] );
watch( activeTransformMode, ( value, oldValue ) => {
    if( !value || value.mode === oldValue.mode ) return;
    CSStore.CS?.setTransformMode( activeTransformMode.value.mode );
});
</script>