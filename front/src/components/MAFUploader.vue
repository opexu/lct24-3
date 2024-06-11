<template>
<div class="card flex justify-content-center">
    
    <Button outlined class="w-full"
    @click="visible = true"
    v-tooltip.bottom = "'Открыть меню загрузки файлов'"
    >Загрузка файлов</Button>

    <Dialog class="text-primary w-1/3 overflow-hidden"
    :pt="{ content: 'relative h-fit overflow-y-auto' }"
    :pt-options="{ mergeProps: true }"
    modal header="Загрузка файлов"
    v-model:visible="visible">
        <template #header>
            <div class="mr-5 text-primary dark:text-surface-300 w-fit flex flex-col space-y-4">
                <span class="text-lg text-primary">Загрузка исходных файлов</span>
            </div>
        </template>
        <div class="relative w-full max-h-full flex flex-col gap-2 overflow-hiden">
            
            <!-- БАЛАНСОДЕРЖАТЕЛИ & РАЙОН & ГРБС & ОКРУГ ИЗ XLSX -->
            <Panel toggleable collapsed>
            <template #header>
                <span class="mr-4 text-white">Балансодержатели, районы, ГРБС, округи</span>
            </template>
            <template #default>
                <div><p class="text-sm text-surface-500">
                    Загрузка производится из файлов .xlsx, в которых есть поля в шапке файла<br>
                    <b>'Балансодержатель', 'Район', 'ГРБС', 'Округ'</b>
                </p></div>
                <div class="w-full h-fit mt-5 flex flex-row">
                    <input id="file-1" type="file" class="peer hidden" accept=".xlsx"
                    :disabled="isLoaded"
                    @input="onBalanceHolderUpload"
                    >
                    <label for="file-1" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-start text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
                    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
                    >Загрузить</label>
                </div>
            </template>
            </Panel>
            
            <!-- ДВОРОВЫЕ ТЕРРИТОРИИ ИЗ XLSX -->
            <Panel toggleable collapsed>
            <template #header>
                <span class="mr-4 text-white">Дворовые территории</span>
            </template>
            <template #default>
                <div><p class="text-sm text-surface-500">
                    Загрузка производится из файлов .xlsx, в которых есть поля в шапке файла<br>
                    <b>'Идентификатор родительского объекта', 'Наименование', 'Общая площадь, кв.м', 
                    'Балансодержатель', 'Район', 'ГРБС', 'Округ'</b>
                </p></div>
                <div class="w-full h-fit mt-5 flex flex-row">
                    <input id="file-2" type="file" class="peer hidden" accept=".xlsx"
                    :disabled="isLoaded"
                    @input="onYardAreaUpload"
                    >
                    <label for="file-2" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-start text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
                    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
                    >Загрузить</label>
                </div>
            </template>
            </Panel>

            <!-- ПЛОСКОСТНЫЕ СООРУЖЕНИЯ ИЗ XLSX -->
            <Panel toggleable collapsed>
            <template #header>
                <span class="mr-4 text-white">Плоскостные сооружения</span>
            </template>
            <template #default>
                <div><p class="text-sm text-surface-500">
                    Загрузка производится из файлов .xlsx, в которых есть поля в шапке файла<br>
                    <b>'ID плоскостного сооружения', 'Статус', 'Тип (назначение)', 'Уточнение', 'Идентификатор родительского объекта', 'Общая площадь, кв.м'</b>
                </p></div>
                <div class="w-full h-fit mt-5 flex flex-row">
                    <input id="file-3" type="file" class="peer hidden" accept=".xlsx"
                    :disabled="isLoaded"
                    @input="onPlaygroundUpload"
                    >
                    <label for="file-3" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-start text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
                    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
                    >Загрузить</label>
                </div>
            </template>
            </Panel>

            <!-- КООРДИНАТЫ ПЛОСКОСТНЫХ СООРУЖЕНИЯ ИЗ XLSX -->
            <Panel toggleable collapsed>
            <template #header>
                <span class="mr-4 text-white">Координаты полигонов плоскостных сооружений</span>
            </template>
            <template #default>
                <div><p class="text-sm text-surface-500">
                    Загрузка производится из файлов .xlsx, в которых есть поля в шапке файла<br>
                    <b>'АСУ ОДС Идентификатор', 'Полигоны в АСУ ОДС (план-схемы)'</b>
                </p></div>
                <div class="w-full h-fit mt-5 flex flex-row">
                    <input id="file-4" type="file" class="peer hidden" accept=".xlsx"
                    :disabled="isLoaded"
                    @input="onPlaygroundCoordsUpload"
                    >
                    <label for="file-4" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-start text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
                    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
                    >Загрузить</label>
                </div>
            </template>
            </Panel>

            <!-- РЕЛЯЦИИ МАФОВ -->
            <Panel toggleable collapsed>
            <template #header>
                <span class="mr-4 text-white">Каталоги, Поставщики, Типы МАФов, Типы территорий</span>
            </template>
            <template #default>
                <div><p class="text-sm text-surface-500">
                    Загрузка производится из файла .zip<br>
                    в который необходимо положить файлы из каталога МАФ (1010001.xml, 1010002.xml и т.д.)
                </p></div>
                <div class="w-full h-fit mt-5 flex flex-row">
                    <input id="file-5" type="file" class="peer hidden" accept=".zip"
                    :disabled="isLoaded"
                    @input="onMAFRelationsUpload"
                    >
                    <label for="file-5" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-start text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
                    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
                    >Загрузить</label>
                </div>
            </template>
            </Panel>

            <!-- АРХИВ МАФОВ -->
            <Panel toggleable collapsed>
            <template #header>
                <span class="mr-4 text-white">Каталог МАФ</span>
            </template>
            <template #default>
                <div><p class="text-sm text-surface-500">
                    Загрузка производится из файла .zip<br>
                    в который необходимо положить файлы из каталога МАФ (1010001.xml, 1010002.xml и т.д.)
                </p></div>
                <div class="w-full h-fit mt-5 flex flex-row">
                    <input id="file-6" type="file" class="peer hidden" accept=".zip"
                    :disabled="isLoaded"
                    @input="onMAFUpload"
                    >
                    <label for="file-6" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-start text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
                    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
                    >Загрузить</label>
                </div>
            </template>
            </Panel>

            <!-- ЛИМИТЫ ФИНАНСИРОВАНИЯ -->
            <Panel toggleable collapsed>
            <template #header>
                <span class="mr-4 text-white">Лимиты финансирования</span>
            </template>
            <template #default>
                <div><p class="text-sm text-surface-500">
                    Загрузка производится из файлов .xlsx, в которых есть поля в шапке файла<br>
                    <b>'Идентификатор родительского объекта', 'Лимит финансирования (у.е.)'</b>
                </p></div>
                <div class="w-full h-fit mt-5 flex flex-row">
                    <input id="file-7" type="file" class="peer hidden" accept=".xlsx"
                    :disabled="isLoaded"
                    @input="onPlaygroundLimitsUpload"
                    >
                    <label for="file-7" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-start text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
                    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
                    >Загрузить</label>
                </div>
            </template>
            </Panel>

            <!-- ТЕКУЩЕЕ НАПОЛНЕНИЕ -->
            <Panel toggleable collapsed>
            <template #header>
                <span class="mr-4 text-white">Текущее наполнение</span>
            </template>
            <template #default>
                <div><p class="text-sm text-surface-500">
                    Загрузка производится из файлов .xlsx, в которых есть поля в шапке файла<br>
                    <b>'ID МАФ', 'Принадлежность элемента к зоне территории'</b> 
                </p></div>
                <div class="w-full h-fit mt-5 flex flex-row">
                    <input id="file-8" type="file" class="peer hidden" accept=".xlsx"
                    :disabled="isLoaded"
                    @input="onPlaygroundMafsUpload"
                    >
                    <label for="file-8" class="w-full h-fit px-4 py-2 m-0 align-bottom leading-[normal] text-start text-primary-500 border border-primary-500 rounded-md cursor-pointer peer-[&:not([disabled])]:hover:bg-primary-300/10"
                    :class="[ isLocked ? 'bg-orange-100' : 'bg-inherit', isLoaded ? 'bg-primary-300/30' : 'bg-inherit' ]"
                    >Загрузить</label>
                </div>
            </template>
            </Panel>
        </div>        
    </Dialog>
</div>
</template>

<script setup lang="ts">
import Panel from 'primevue/panel';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useApi } from '@/composables/useAPI';
import { PROJECT_API, PROJECT_KEY } from '@/api/project';
import { MAF_API, MAF_KEY } from '@/api/maf';
import { BALANCE_HOLDER_API, BALANCE_HOLDER_KEY } from '@/api/balance-holder';
import { YARD_AREA_API, YARD_AREA_KEY } from '@/api/yard-area';
import { PLAYGROUND_API, PLAYGROUND_KEY } from '@/api/playground';
defineProps<{
    isLocked: boolean;
}>();

const visible = ref(false);

const { strapipost } = useApi();

const isLoaded = ref(false);

async function onBalanceHolderUpload( event: Event ){
    const inputEl = <HTMLInputElement> event.target;
    const file = _getInputFile( inputEl );
    if( !file ) return;

    try{
        const res = await strapipost( BALANCE_HOLDER_API[BALANCE_HOLDER_KEY.POST_BALANCE_HOLDER_XLSX], file );
    }catch(e){
        console.error('Ошибка загрузки файла балансодержателя');
    }
    
    inputEl.value = '';
}

async function onYardAreaUpload( event: Event ){
    const inputEl = <HTMLInputElement> event.target;
    const file = _getInputFile( inputEl );
    if( !file ) return;

    try{
        const res = await strapipost( YARD_AREA_API[YARD_AREA_KEY.POST_YARD_AREA_XLSX], file );
    }catch(e){
        console.error('Ошибка загрузки файла балансодержателя');
    }
    
    inputEl.value = '';
}

async function onPlaygroundUpload( event: Event ){
    const inputEl = <HTMLInputElement> event.target;
    const file = _getInputFile( inputEl );
    if( !file ) return;

    try{
        const res = await strapipost( PLAYGROUND_API[PLAYGROUND_KEY.POST_PLAYGROUND_XLSX], file );
    }catch(e){
        console.error('Ошибка загрузки файла балансодержателя');
    }
    
    inputEl.value = '';
}

async function onPlaygroundCoordsUpload( event: Event ){
    const inputEl = <HTMLInputElement> event.target;
    const file = _getInputFile( inputEl );
    if( !file ) return;

    try{
        const res = await strapipost( PLAYGROUND_API[PLAYGROUND_KEY.POST_PLAYGROUND_COORDS_XLSX], file );
    }catch(e){
        console.error('Ошибка загрузки файла балансодержателя');
    }
    
    inputEl.value = '';
}

async function onMAFUpload( event: Event ){
    const inputEl = <HTMLInputElement> event.target;
    const file = _getInputFile( inputEl );
    if( !file ) return;
    
    try{
        const res = await strapipost( MAF_API[MAF_KEY.POST_MAF_ZIP], file );
    }catch(e){
        console.error('Ошибка загрузки файлов maf')
    }
    
    inputEl.value = '';
}

async function onMAFRelationsUpload( event: Event ){
    const inputEl = <HTMLInputElement> event.target;
    const file = _getInputFile( inputEl );
    if( !file ) return;
    
    try{
        const res = await strapipost( MAF_API[MAF_KEY.POST_MAF_RELATIONS_ZIP], file );
    }catch(e){
        console.error('Ошибка загрузки файлов maf')
    }
    
    inputEl.value = '';
}

async function onPlaygroundMafsUpload( event: Event ){
    const inputEl = <HTMLInputElement> event.target;
    const file = _getInputFile( inputEl );
    if( !file ) return;
    
    try{
        const res = await strapipost( PLAYGROUND_API[PLAYGROUND_KEY.POST_PLAYGROUND_MAFS_XLSX], file );
    }catch(e){
        console.error('Ошибка загрузки файлов maf')
    }
    
    inputEl.value = '';
}

async function onPlaygroundLimitsUpload( event: Event ){
    const inputEl = <HTMLInputElement> event.target;
    const file = _getInputFile( inputEl );
    if( !file ) return;
    
    try{
        const res = await strapipost( PLAYGROUND_API[PLAYGROUND_KEY.POST_PLAYGROUND_LIMITS_XLSX], file );
    }catch(e){
        console.error('Ошибка загрузки файлов maf')
    }
    
    inputEl.value = '';
}

function _getInputFile( inputEl: HTMLInputElement ){
    if( !inputEl?.files?.length ){
        inputEl.value = '';
        return;
    }

    const file = inputEl.files.item( 0 );
    if( !file ){
        inputEl.value = '';
        return;
    }

    return file;
}
</script>