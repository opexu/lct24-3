<template>
<div class="w-full h-fit flex flex-row space-x-2">
    <div class="w-full h-fit flex flex-row">
        <input id="file-dxf" type="file" class="peer hidden" accept=".dxf"
        :disabled="isLoaded"
        @input="onDXFUpload"
        >
        <label for="file-dxf" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-center text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
        :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
        >Загрузить .DXF</label>
    </div>
    
    <Button outlined class="w-fit px-8 py-2"
    v-if="isLoaded"
    v-tooltip.down="'Очистить сцену'"
    @click="clearDxf" 
    >Очистить</Button>
</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import DxfParser from 'dxf-parser';
import { ref } from 'vue';
import { useDXFStore } from '@/stores/dxf-store';
import { useApi } from '@/composables/useAPI';
import { PROJECT_API, PROJECT_KEY } from '@/api/project';
defineProps<{
    isLocked: boolean;
}>();

const { strapipost } = useApi();

const isLoaded = ref(false);
const DXFStore = useDXFStore();

async function onDXFUpload( event: Event ){

    const inputEl = <HTMLInputElement> event.target;
    
    if( !inputEl?.files?.length ){
        inputEl.value = '';
        return;
    }

    const file = inputEl.files.item( 0 );
    if( !file ){
        inputEl.value = '';
        return;
    }
    
    strapipost( PROJECT_API[PROJECT_KEY.POST_PROJECT], file, file.name );
    
    console.log('dxfFile: ', file)
    inputEl.value = '';

    const fileReader = new FileReader();

    fileReader.addEventListener('load', ( event ) => {

        const parser = new DxfParser();
        if( typeof fileReader.result !== 'string' ) 
        {
            inputEl.value = '';
            return;
        }
        const dxf =  parser.parseSync( fileReader.result );
        if( !dxf ){
            inputEl.value = '';
            return;
        }
        
        isLoaded.value = true;
        inputEl.value = '';

        DXFStore.onDxfUploaded( dxf );
    })
    fileReader.addEventListener('error', ( event ) => {
        console.error('fileReader Error: ', event)
    })

    fileReader.readAsText( file, 'utf-8' );
}

function clearDxf(){
    DXFStore.clearDxf();
    isLoaded.value = false;
}
</script>