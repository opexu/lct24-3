<template>
<div class="w-full h-fit p-2 flex flex-col space-y-2 border border-primary rounded-md">
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">ID: </p><p class="text-right">{{ geoProp.id }}</p></div>
    <!-- <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Тип: </p><p class="text-right">{{ geoProp.type }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Тип объекта: </p><p class="text-right">{{ geoProp.engineType }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Слой: </p><p class="text-right">{{ geoProp.layer }}</p></div> -->
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Положение: </p><p class="text-right">{{ Math.round( geoProp.origin.x ) }}, {{ Math.round( geoProp.origin.z ) }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Угол: </p><p class="text-right">{{ Math.round( geoProp.angle ) }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Ширина: </p><p class="text-right">{{ Math.round( geoProp.width ) }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Длина: </p><p class="text-right">{{ Math.round( geoProp.length ) }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary" v-if="geoProp.price">Цена: </p><p class="text-right">{{ geoProp.price ? Math.round( geoProp.price ) : 0 }}</p></div>
    <Button class="w-full" 
    outlined
    v-tooltip.right="'Удалить'"
    @click="onRemoveClick"
    >Удалить</Button>
</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import type { ICSGeoProps } from '@/scripts/CSLib';
import { useCSStore } from '@/stores/cs-store';
import { usePlaygroundStore } from '@/stores/playground-store';

const CSStore = useCSStore();
const props = defineProps<{ geoProp: ICSGeoProps }>();
const PlaygroundStore = usePlaygroundStore();

function onRemoveClick(){
    CSStore.CS?.removeMaf( props.geoProp.id );
    if( props.geoProp.price ) PlaygroundStore.removePrice( props.geoProp.price );
    
}
</script>