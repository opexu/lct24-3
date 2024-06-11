<template>
<div class="w-full h-fit flex flex-col gap-2">
    <PlaygroundProp
    v-for="(prop, i) in playgroundProps" :key="i"
    :title="prop.title"
    :value="prop.value"
    />

    <div class="w-full h-full flex flex-row gap-2">
        <Button outlined class="w-full"
        :disabled="!selectedPlayground"
        @click="onDrawPlaygroundClick"
        v-tooltip.bottom = "'Отобразить границы площадки'"
        >Отобразить границы</Button>
        <Button outlined class="pi pi-times"
        :disabled="!selectedPlayground"
        @click="onRemovePlaygroundClick"
        v-tooltip.bottom = "'Удалить площадку'"
        />
    </div>
    
</div>
</template>
<script setup lang="ts">
import type { IPlaygroundFull } from '@/types/IReestr';
import type { IStrapi } from '@/types/strapi';
import PlaygroundProp from '@/components/Info/PlaygroundProp.vue';
import { computed } from 'vue';
import { usePlaygroundStore } from '@/stores/playground-store';
import { storeToRefs } from 'pinia';
import { useCSStore } from '@/stores/cs-store';
import Button from 'primevue/button';
const PlaygroundStore = usePlaygroundStore();
const { selectedPlayground } = storeToRefs( PlaygroundStore );
const CSStore = useCSStore();

const props = defineProps<{
    playground: IStrapi<IPlaygroundFull>;
}>();

const playgroundProps = computed(() => {
    return [
        { title: 'ID площадки', value: props.playground.id },
        { title: 'Тип', value: props.playground.attributes.Type },
        { title: 'Комментарий', value: props.playground.attributes.TypeComment },
        { title: 'Статус', value: props.playground.attributes.Status },
        { title: 'Площадь', value: props.playground.attributes.Square },
        { title: 'Лимит финансирования', value: props.playground.attributes.FundingLimit },
        { title: 'ID территории', value:  props.playground.attributes.yard_area.data.id },
        { title: 'Адрес', value: props.playground.attributes.yard_area.data.attributes.Title },
        { title: 'Площадь территории', value: props.playground.attributes.yard_area.data.attributes.Square },
        { title: 'Район', value: props.playground.attributes.yard_area.data.attributes.region.data.attributes.Title },
        { title: 'Округ', value: props.playground.attributes.yard_area.data.attributes.district.data.attributes.Title },
        { title: 'ГРБС', value: props.playground.attributes.yard_area.data.attributes.grbc.data.attributes.Title },
        { title: 'Балансодержатель', value: props.playground.attributes.yard_area.data.attributes.balance_holder.data.attributes.Title },
    ]
});

function onDrawPlaygroundClick(){
    if( !selectedPlayground.value ) return;
    if( CSStore.CS?.HasBorders ) CSStore.CS?.removeBorders();
    CSStore.CS?.drawBorders( selectedPlayground.value );
}

function onRemovePlaygroundClick(){
    if( !selectedPlayground.value ) return;
    selectedPlayground.value = undefined;
}
</script>