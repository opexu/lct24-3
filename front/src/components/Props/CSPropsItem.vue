<template>
<div class="w-full h-fit p-2 flex flex-col space-y-2 border border-primary rounded-md">
    <!-- <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">ID: </p><p class="text-right">{{ geoProp.id }}</p></div> -->
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Тип: </p><p class="text-right">{{ geoProp.type }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Слой: </p><p class="text-right">{{ geoProp.layer }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Положение: </p><p class="text-right">{{ Math.round( geoProp.origin.x ) }}, {{ Math.round( geoProp.origin.z ) }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Угол: </p><p class="text-right">{{ Math.round( geoProp.angle ) }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Ширина: </p><p class="text-right">{{ Math.round( geoProp.width ) }}</p></div>
    <div class="w-full h-fit flex flex-row justify-between"><p class="text-primary">Длина: </p><p class="text-right">{{ Math.round( geoProp.length ) }}</p></div>
</div>
</template>

<script setup lang="ts">
import type { ICSGeoProps } from '@/scripts/CSLib';

const props = defineProps<{ geoProp: ICSGeoProps }>();
</script>