<template>
<div class="w-full h-fit flex flex-row">
    <label for="file-dxf" class="w-full h-fit px-4 py-2 m-0 text-center text-primary-500 border border-primary-500 rounded-md cursor-pointer hover:bg-primary-300/10"
    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit' ]"
    >Загрузить .DXF</label>
    <input id="file-dxf" type="file" class="hidden" accept=".dxf"
    @input="onDXFUpload"
    >
</div>
</template>

<script setup lang="ts">
import { CSDXFParser } from '@/scripts/CSLib';
import { useCSStore } from '@/stores/cs-store';
import DxfParser2 from 'dxf-parser';
defineProps<{
    isLocked: boolean;
}>();

const CSStore = useCSStore();

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
    
    console.log('dxfFile: ', file)
    inputEl.value = '';

    const fileReader = new FileReader();

    fileReader.addEventListener('load', ( event ) => {

        const parser = new DxfParser2();
        if( typeof fileReader.result !== 'string' ) 
        {
            inputEl.value = '';
            return;
        }
        const dxf =  parser.parseSync( fileReader.result );
        if( !dxf || !CSStore.CS ){
            inputEl.value = '';
            return;
        }
        
        console.log('dxf: ', dxf);
        CSStore.CS.drawDxf( dxf );
        
        inputEl.value = '';
    })
    fileReader.addEventListener('error', ( event ) => {
        console.error('fileReader Error: ', event)
    })

    fileReader.readAsText( file, 'utf-8' );
}
</script>