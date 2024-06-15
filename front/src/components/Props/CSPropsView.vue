<template>
<div class="w-full h-fit flex flex-col gap-2">
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
import { CSEvent, type CSObject, type ICSDXFObject, type ICSGeoProps, type ICSMafObject, type ICSObject } from '@/scripts/CSLib';

const CSStore = useCSStore();
const { SelectedCSArr } = storeToRefs( CSStore );

const geoProps = ref<ICSGeoProps[]>([]);

onMounted(() => {
    CSStore.CS?.on( CSEvent.SELECT, onUpdate )
    CSStore.CS?.on( CSEvent.DESELECT, onUpdate )
    CSStore.CS?.on( CSEvent.TRANSFORM_UPDATE, onUpdate )
    CSStore.CS?.on( CSEvent.UPDATED, onUpdate )
    onUpdate();
})
onUnmounted(() => {
    CSStore.CS?.off( CSEvent.SELECT, onUpdate )
    CSStore.CS?.off( CSEvent.DESELECT, onUpdate )
    CSStore.CS?.off( CSEvent.TRANSFORM_UPDATE, onUpdate )
    CSStore.CS?.off( CSEvent.UPDATED, onUpdate )
})
function onUpdate(){
    // geoProps.value = SelectedCSArr.value.filter( cs => !cs.IsMaf ).map( cs => ( cs as unknown as ICSDXFObject).GeoProps );
    geoProps.value = SelectedCSArr.value.map( cs => cs.GeoProps );
}
</script>