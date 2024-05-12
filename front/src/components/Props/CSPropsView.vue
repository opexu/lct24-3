<template>
<div class="w-full h-fit flex flex-col space-y-2">
    <CSPropsItem v-for="( geoProp ) in geoProps" :key="geoProp.id"
    :geoProp="geoProp"
    />
</div>
</template>

<script setup lang="ts">
import { useCSStore } from '@/stores/cs-store';
import CSPropsItem from './CSPropsItem.vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { CSEvent, type ICSGeoProps } from '@/scripts/CSLib';

const CSStore = useCSStore();
const { SelectedDXFCSArr } = storeToRefs( CSStore );

const geoProps = ref<ICSGeoProps[]>([]);

onMounted(() => {
    CSStore.CS?.on( CSEvent.DXF_OBJ_SELECT, onUpdate )
    CSStore.CS?.on( CSEvent.DXF_OBJ_DESELECT, onUpdate )
    CSStore.CS?.on( CSEvent.DXF_OBJ_TRANSFORM_UPDATE, onUpdate )
    onUpdate();
})
onUnmounted(() => {
    CSStore.CS?.off( CSEvent.DXF_OBJ_SELECT, onUpdate )
    CSStore.CS?.off( CSEvent.DXF_OBJ_DESELECT, onUpdate )
    CSStore.CS?.off( CSEvent.DXF_OBJ_TRANSFORM_UPDATE, onUpdate )
})
function onUpdate(){
    geoProps.value = SelectedDXFCSArr.value.map( csdxfobj => csdxfobj.GeoProps );
}
</script>