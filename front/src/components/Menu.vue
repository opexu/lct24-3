<template>
<div class="w-full h-full text-surface-0 rounded-lg flex flex-col space-y-2">
    
    <Panel toggleable>
        <template #header>
            <span>Конструктор</span>
        </template>
        <template #default>
            <DXFUploader class="w-full h-full relative" :is-locked="false"/>
        </template>
        
    </Panel>
    
    <Panel toggleable>
        <template #header>
            <span>Свойства</span>
        </template>
        <p class="m-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, quibusdam. Reiciendis eveniet est maiores adipisci, quis et? Maxime quia velit obcaecati totam aut dolor voluptatum rem asperiores, deserunt maiores delectus.</p>
    </Panel>
</div>
</template>

<script setup lang="ts">
import Panel from 'primevue/panel';
import DXFUploader from './DXFUploader.vue';
</script>