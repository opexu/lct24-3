<template>
    <div class="w-full h-full flex flex-row space-x-2 text-surface-0">
        <div ref="csRootRef" class="rounded-lg"></div>
        <div ref="csRightPanelRef" class="w-fit h-full flex flex-col space-y-2">
            <!-- <ToggleButton outlined
            :pt="{
                box: 'border bg-primary-300'
            }"
            :ptOptions="{ mergeProps: true }" 
            onLabel="2D" offLabel="3D"
            v-model="is2D"
            v-tooltip.left="'Смена режима камеры'"
            @click=""
            /> -->
            <Button :outlined="is2D"
            v-tooltip.left="'Изменить камеру. Для движения используйте ПКМ + Shift'"
            @click="is2D = !is2D" 
            >{{ is2D ? "2D" : "3D" }}</Button>
            <Button outlined
            v-tooltip.left="'Центрировать камеру'"
            @click="recenterCamera" 
            >О</Button>
            <TransformMode/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLogout } from '@/composables/useLogout';
import { CAMERA_TYPE } from '@/scripts/CSLib/src/CSCameraControls';
import { useCSDXFEvents } from '@/stores/_cs-events';
import { useCSStore } from '@/stores/cs-store';
import Button from 'primevue/button';
import TransformMode from './TransformMode.vue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const logout = useLogout();
const CSStore = useCSStore();

const csRootRef = ref<InstanceType<typeof HTMLDivElement>|null>();
const csRightPanelRef = ref<InstanceType<typeof HTMLDivElement>|null>();
const rpWidth = computed(() => csRightPanelRef.value?.offsetWidth ?? 0 );
defineExpose({ csRoot: csRootRef, rpWidth: rpWidth });

onMounted( async () => {
    if( csRootRef.value ){
        CSStore.init( csRootRef.value );
    }else{
        await nextTick();
        if( csRootRef.value ){
            CSStore.init( csRootRef.value );
        }else{
            console.error('Ошибка инициализации приложения');
            logout.logout();
        }
    }

    CSStore.CS?.setBackgroundColor( '#183240' );
})

const is2D = ref(false);
watch( is2D, ( value ) => {
    CSStore.CS?.switchCamera( value ? CAMERA_TYPE.ORTHOGRAPHIC : CAMERA_TYPE.PERSPECTIVE );
})

function recenterCamera(){
    CSStore.CS?.recenterCamera();
}
</script>