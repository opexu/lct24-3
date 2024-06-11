<template>
<div class="w-full h-fit flex flex-row items-center justify-between">
    <p class="font-bold text-white text-opacity-50">{{ title }}</p>
    <p>{{ value }}</p>
</div>
</template>

<script setup lang="ts">
defineProps<{
    title: string | number,
    value?: string | number,
}>();
</script>