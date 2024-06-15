<template>
<Dialog class="text-primary w-1/3 overflow-hidden"
:pt="{ content: 'relative h-fit overflow-y-auto' }"
:pt-options="{ mergeProps: true }"
modal header="Загрузка файлов"
v-model:visible="visible">
    <template #header>
        <div class="mr-5 text-primary dark:text-surface-300 w-fit flex flex-col space-y-4">
            <span class="text-lg text-primary">Выбор параметров</span>
        </div>
    </template>
    <div class="relative w-full max-h-full flex flex-col gap-2 overflow-hiden">
        <Dropdown class="w-full"
        filter showClear
        :resetFilterOnHide="true"
        v-model="selectedPlayground"
        :options="playgroundsArr"
        :optionLabel="( option: IStrapi<(IPlayground & IPlaygroundYardAreaRelation)> ) => {
            return option?.id + ' - ' + option?.attributes?.Type + ' - ' + option?.attributes?.yard_area?.data?.id + ' - ' + option.attributes?.yard_area?.data.attributes?.Title
        }"
        placeholder="Выбрать площадку"
        >
            <template #option="{ option, index }: { option: IStrapi<(IPlayground & IPlaygroundYardAreaRelation)>, index: number }">
                {{ option?.id ?? 'б/н' }} - {{ option?.attributes?.Type ?? 'б/н' }} - {{ option?.attributes?.yard_area?.data?.id ?? 'б/н' }} - {{ option.attributes?.yard_area?.data.attributes?.Title ?? 'б/н' }}
            </template>
        </Dropdown>
        <Button outlined class="w-full"
        :disabled="!selectedPlayground"
        @click="onDrawPlaygroundClick"
        v-tooltip.bottom = "'Отобразить границы площадки'"
        >Отобразить границы</Button>
    </div>
</Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { type IAxios, type IStrapi } from '@/types/strapi';
import type { IPlayground, IPlaygroundFull, IPlaygroundYardAreaRelation } from '@/types/IReestr';
import { onMounted, watch } from 'vue';
import { usePlaygroundStore } from '@/stores/playground-store';
import { storeToRefs } from 'pinia';
import { useApi } from '@/composables/useAPI';
import { PLAYGROUND_API, PLAYGROUND_KEY } from '@/api/playground';
import { useCSStore } from '@/stores/cs-store';

const { strapiget } = useApi();

const visible = defineModel<boolean>('selectPlaygroundVisible');

const PlaygroundStore = usePlaygroundStore();
const { playgroundsArr, selectedPlayground } = storeToRefs( PlaygroundStore );
const CSStore = useCSStore();

onMounted( async () => {
    const playgroundsRes = await strapiget<IAxios<IStrapi<IPlaygroundFull>[]>, PLAYGROUND_API[PLAYGROUND_KEY.GET_ALL]>( PLAYGROUND_API[PLAYGROUND_KEY.GET_ALL] );
    playgroundsArr.value = playgroundsRes.data.data;
})

watch( selectedPlayground, ( value ) => {
    if( !value ) CSStore.CS?.removeBorders();
});
function onDrawPlaygroundClick(){
    if( !selectedPlayground.value ) return;
    if( CSStore.CS?.HasBorders ) CSStore.CS?.removeBorders();
    CSStore.CS?.drawBorders( selectedPlayground.value );
}
</script>onMounted, 